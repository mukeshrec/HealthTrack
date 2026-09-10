import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { extractHealthEventsFromDocument, generateHealthMemoryChatResponse } from './src/services/llm';

const app = express();
const prisma = new PrismaClient();
const PORT = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-healthtrack';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Setup Multer for local uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });
// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    
    let healthId = null;
    if (role === 'patient') {
      // Generate a unique 6-character alphanumeric ID
      healthId = 'HT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    const user = await prisma.user.create({ data: { email, passwordHash, name, role, healthId } });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const onboardingComplete = role === 'caregiver'; 
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, healthId: user.healthId }, onboardingComplete });
  } catch (error) { res.status(500).json({ error: 'Registration failed' }); }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    let onboardingComplete = false;
    if (user.role === 'patient') {
      const profile = await prisma.patientProfile.findUnique({ where: { userId: user.id } });
      onboardingComplete = !!profile;
    } else { onboardingComplete = true; }
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, healthId: user.healthId }, onboardingComplete });
  } catch (error) { res.status(500).json({ error: 'Login failed' }); }
});

// --- PROFILE ROUTES ---
app.post('/api/patients/profile', authenticateToken, async (req: any, res: any) => {
  const { personalDetails, existingConditions, allergies, bloodGroup, emergencyContacts, preferredLanguage, doctorInformation, medicalHistory } = req.body;
  try {
    const profile = await prisma.patientProfile.upsert({
      where: { userId: req.user.userId },
      update: { personalDetails, existingConditions, allergies, bloodGroup, emergencyContacts, preferredLanguage, doctorInformation, medicalHistory },
      create: { userId: req.user.userId, personalDetails, existingConditions, allergies, bloodGroup, emergencyContacts, preferredLanguage, doctorInformation, medicalHistory },
    });
    res.json(profile);
  } catch (error) { res.status(500).json({ error: 'Failed to update profile' }); }
});

app.get('/api/patients/profile', authenticateToken, async (req: any, res: any) => {
  try {
    const profile = await prisma.patientProfile.findUnique({ where: { userId: req.user.userId } });
    res.json(profile);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch profile' }); }
});

// --- HEALTH MEMORY ROUTES ---

// Upload a document and extract events
app.post('/api/memory/documents', authenticateToken, upload.single('document'), async (req: any, res: any) => {
  const { documentDate, source, description, base64, fileName: customFileName, mimeType: customMimeType } = req.body;
  
  let filePath = '';
  let fileName = '';
  let mimeType = '';
  let documentUrl = '';

  if (req.file) {
    filePath = req.file.path;
    fileName = req.file.originalname;
    mimeType = req.file.mimetype;
    documentUrl = `/uploads/${req.file.filename}`;
  } else if (base64) {
    const rawBase64 = base64.includes('base64,') ? base64.split('base64,')[1] : base64;
    const buffer = Buffer.from(rawBase64, 'base64');
    fileName = customFileName || `upload_${Date.now()}.jpg`;
    mimeType = customMimeType || 'image/jpeg';
    const diskFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    filePath = path.join(uploadDir, diskFileName);
    fs.writeFileSync(filePath, buffer);
    documentUrl = `/uploads/${diskFileName}`;
  } else {
    return res.status(400).json({ error: 'No file or base64 image uploaded' });
  }

  try {
    const profile = await prisma.patientProfile.findUnique({ where: { userId: req.user.userId } });
    if (!profile) return res.status(404).json({ error: 'Patient profile not found' });

    // 1. Save document record
    const healthDoc = await prisma.healthDocument.create({
      data: {
        patientId: profile.id,
        fileUrl: documentUrl,
        fileType: mimeType,
        fileName: fileName,
        documentDate: documentDate ? new Date(documentDate) : new Date(),
        source: source || 'User Upload',
        description,
        status: 'EXTRACTING'
      }
    });

    // 2. Perform Extraction via Gemini / OCR
    try {
      const extractionResult = await extractHealthEventsFromDocument(filePath, mimeType, profile.id);
      
      // 3. Save extracted events securely
      const eventsData = (extractionResult.events || []).map((ev: any) => ({
        patientId: profile.id,
        eventType: ev.eventType || 'Observation',
        eventDate: ev.eventDate ? new Date(ev.eventDate) : new Date(),
        isFuture: ev.isFuture || false,
        title: ev.title || 'Extracted Health Event',
        description: ev.description || extractionResult.summary,
        provenance: 'AI_EXTRACTED',
        verificationStatus: 'UNVERIFIED',
        sourceDocumentId: healthDoc.id,
        metadata: {
          ...(ev.metadata || {}),
          extractedTextSnippet: extractionResult.extractedText ? extractionResult.extractedText.slice(0, 300) : ''
        }
      }));

      if (eventsData.length > 0) {
        await prisma.healthEvent.createMany({ data: eventsData });
      }

      // 4. Update Document with full extracted text and summary
      const updatedDoc = await prisma.healthDocument.update({
        where: { id: healthDoc.id },
        data: {
          status: 'EXTRACTED',
          extractedText: extractionResult.extractedText,
          summary: extractionResult.summary,
        }
      });

      return res.json({
        message: 'Document analyzed and transcribed successfully',
        document: updatedDoc,
        extractedText: extractionResult.extractedText,
        summary: extractionResult.summary,
        eventsCount: eventsData.length
      });
    } catch (extractError: any) {
      console.error("Extraction failed for document", healthDoc.id, extractError);
      const failedDoc = await prisma.healthDocument.update({
        where: { id: healthDoc.id },
        data: {
          status: 'FAILED',
          extractedText: 'Text extraction failed for this document.',
        }
      });
      return res.json({ message: 'Document uploaded (extraction pending/failed)', document: failedDoc });
    }
  } catch (error) {
    console.error("Document upload error:", error);
    res.status(500).json({ error: 'Document upload failed' });
  }
});

// Get all uploaded documents with extracted text
app.get('/api/memory/documents', authenticateToken, async (req: any, res: any) => {
  try {
    const profile = await prisma.patientProfile.findUnique({ where: { userId: req.user.userId } });
    if (!profile) return res.status(404).json({ error: 'Patient profile not found' });

    const docs = await prisma.healthDocument.findMany({
      where: { patientId: profile.id },
      orderBy: { uploadDate: 'desc' },
      include: { events: true }
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Get single document with full extracted text
app.get('/api/memory/documents/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const doc = await prisma.healthDocument.findUnique({
      where: { id: req.params.id },
      include: { events: true }
    });
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// Delete a document and its events
app.delete('/api/memory/documents/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const docId = req.params.id;
    // Delete associated events
    await prisma.healthEvent.deleteMany({ where: { sourceDocumentId: docId } });
    // Delete document
    await prisma.healthDocument.delete({ where: { id: docId } });
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Clear all documents and events for the current user
app.delete('/api/memory/clear-all', authenticateToken, async (req: any, res: any) => {
  try {
    const profile = await prisma.patientProfile.findUnique({ where: { userId: req.user.userId } });
    if (!profile) return res.status(404).json({ error: 'Patient profile not found' });

    await prisma.healthEvent.deleteMany({ where: { patientId: profile.id } });
    await prisma.healthDocument.deleteMany({ where: { patientId: profile.id } });
    res.json({ message: 'All health records cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear records' });
  }
});

// Get Timeline Events
app.get('/api/memory/timeline', authenticateToken, async (req: any, res: any) => {
  const { category, isFuture } = req.query;
  try {
    const profile = await prisma.patientProfile.findUnique({ where: { userId: req.user.userId } });
    if (!profile) return res.status(404).json({ error: 'Patient profile not found' });

    let whereClause: any = { patientId: profile.id };
    if (category && category !== 'All') whereClause.eventType = category;
    if (isFuture !== undefined) whereClause.isFuture = isFuture === 'true';

    const events = await prisma.healthEvent.findMany({
      where: whereClause,
      orderBy: { eventDate: 'desc' },
      include: { sourceDocument: true } // Include document data with full extractedText
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

// Create manual event (Patient Reported / Caregiver Reported)
app.post('/api/memory/events', authenticateToken, async (req: any, res: any) => {
  const { eventType, eventDate, isFuture, title, description, provenance, metadata } = req.body;
  try {
    const profile = await prisma.patientProfile.findUnique({ where: { userId: req.user.userId } });
    if (!profile) return res.status(404).json({ error: 'Patient profile not found' });

    const event = await prisma.healthEvent.create({
      data: {
        patientId: profile.id,
        eventType,
        eventDate: new Date(eventDate),
        isFuture: isFuture || false,
        title,
        description,
        provenance: provenance || (req.user.role === 'patient' ? 'PATIENT_REPORTED' : 'CAREGIVER_REPORTED'),
        verificationStatus: 'UNVERIFIED', // Manual entry can be unverified or verified depending on the app rules
        metadata: metadata || {}
      }
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// --- CAREGIVER CONNECTION ROUTES ---

// Caregiver requests access to a patient using Health ID
app.post('/api/connections/request', authenticateToken, async (req: any, res: any) => {
  const { healthId } = req.body;
  try {
    const patientUser = await prisma.user.findUnique({ where: { healthId } });
    if (!patientUser || patientUser.role !== 'patient') return res.status(404).json({ error: 'Invalid Health ID' });

    const existingConnection = await prisma.careConnection.findUnique({
      where: { patientId_caregiverId: { patientId: patientUser.id, caregiverId: req.user.userId } }
    });
    if (existingConnection) return res.status(400).json({ error: 'Connection already exists or is pending' });

    const connection = await prisma.careConnection.create({
      data: { patientId: patientUser.id, caregiverId: req.user.userId, status: 'PENDING' }
    });
    res.json(connection);
  } catch (error) { res.status(500).json({ error: 'Failed to request connection' }); }
});

// Patient gets pending requests
app.get('/api/connections/pending', authenticateToken, async (req: any, res: any) => {
  try {
    const requests = await prisma.careConnection.findMany({
      where: { patientId: req.user.userId, status: 'PENDING' },
      include: { caregiver: { select: { name: true, email: true } } }
    });
    res.json(requests);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch requests' }); }
});

// Patient accepts request
app.post('/api/connections/accept', authenticateToken, async (req: any, res: any) => {
  const { connectionId } = req.body;
  try {
    const connection = await prisma.careConnection.update({
      where: { id: connectionId, patientId: req.user.userId },
      data: { status: 'ACCEPTED' }
    });
    res.json(connection);
  } catch (error) { res.status(500).json({ error: 'Failed to accept connection' }); }
});

// Caregiver gets their accepted patients
app.get('/api/connections/patients', authenticateToken, async (req: any, res: any) => {
  try {
    const connections = await prisma.careConnection.findMany({
      where: { caregiverId: req.user.userId, status: 'ACCEPTED' },
      include: { 
        patient: { 
          select: { id: true, name: true, healthId: true, patientProfile: true }
        } 
      }
    });
    const patients = connections.map(c => c.patient);
    res.json(patients);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch linked patients' }); }
});

// --- AI CHAT ENGINE (GEMINI CLINICAL HEALTH MEMORY) ---
app.post('/api/chat', authenticateToken, async (req: any, res: any) => {
  const { patientId, message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    let targetPatientProfile: any = null;
    let targetPatientUser: any = null;

    // 1. Try finding by userId or profile ID
    if (patientId) {
      targetPatientUser = await prisma.user.findUnique({
        where: { id: patientId },
        include: { patientProfile: true }
      });

      if (!targetPatientUser) {
        // Try by healthId
        targetPatientUser = await prisma.user.findUnique({
          where: { healthId: patientId },
          include: { patientProfile: true }
        });
      }

      if (targetPatientUser?.patientProfile) {
        targetPatientProfile = targetPatientUser.patientProfile;
      } else {
        targetPatientProfile = await prisma.patientProfile.findUnique({
          where: { id: patientId },
          include: { user: true }
        });
        if (targetPatientProfile) {
          targetPatientUser = targetPatientProfile.user;
        }
      }
    }

    // 2. Fallback to authenticated user's profile or first available patient profile
    if (!targetPatientProfile) {
      targetPatientProfile = await prisma.patientProfile.findUnique({
        where: { userId: req.user.userId },
        include: { user: true }
      });
      if (targetPatientProfile) {
        targetPatientUser = targetPatientProfile.user;
      }
    }

    // 3. Fallback to most recent patient profile in the DB (for demo/caregiver access)
    if (!targetPatientProfile) {
      targetPatientProfile = await prisma.patientProfile.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { user: true }
      });
      if (targetPatientProfile) {
        targetPatientUser = targetPatientProfile.user;
      }
    }

    // 4. Fetch all documents with full extracted text
    let documents: any[] = [];
    let events: any[] = [];

    if (targetPatientProfile) {
      documents = await prisma.healthDocument.findMany({
        where: { patientId: targetPatientProfile.id },
        orderBy: { uploadDate: 'desc' },
      });

      events = await prisma.healthEvent.findMany({
        where: { patientId: targetPatientProfile.id },
        orderBy: { eventDate: 'desc' },
      });
    }

    const patientName = targetPatientUser?.name || 'Lakshmi Devi';
    const patientHealthId = targetPatientUser?.healthId || 'HT-8829-4109';

    // 5. Run Gemini AI reasoning over all patient health memory
    const reply = await generateHealthMemoryChatResponse({
      patientName,
      patientHealthId,
      profile: targetPatientProfile,
      documents,
      events,
      question: message.trim(),
    });

    res.json({ reply, patientName, patientHealthId, documentsAnalyzed: documents.length });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response from Gemini' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
