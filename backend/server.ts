import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { extractHealthEventsFromDocument } from './src/services/llm';

const app = express();
const prisma = new PrismaClient();
const PORT = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-healthtrack';

app.use(cors());
app.use(express.json());

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
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  const { documentDate, source, description } = req.body;

  try {
    const profile = await prisma.patientProfile.findUnique({ where: { userId: req.user.userId } });
    if (!profile) return res.status(404).json({ error: 'Patient profile not found' });

    // 1. Save document record
    const documentUrl = `/uploads/${req.file.filename}`;
    const healthDoc = await prisma.healthDocument.create({
      data: {
        patientId: profile.id,
        fileUrl: documentUrl,
        fileType: req.file.mimetype,
        documentDate: documentDate ? new Date(documentDate) : new Date(),
        source: source || 'User Upload',
        description,
        status: 'EXTRACTING'
      }
    });

    res.json({ message: 'Document uploaded, extracting data...', document: healthDoc });

    // 2. Async Extraction via Gemini
    try {
      const extractedEvents = await extractHealthEventsFromDocument(req.file.path, req.file.mimetype, profile.id);
      
      // 3. Save extracted events securely
      const eventsData = extractedEvents.map((ev: any) => ({
        patientId: profile.id,
        eventType: ev.eventType,
        eventDate: ev.eventDate ? new Date(ev.eventDate) : new Date(),
        isFuture: ev.isFuture || false,
        title: ev.title,
        description: ev.description,
        provenance: 'AI_EXTRACTED',
        verificationStatus: 'UNVERIFIED',
        sourceDocumentId: healthDoc.id,
        metadata: ev.metadata || {}
      }));

      await prisma.healthEvent.createMany({ data: eventsData });

      // 4. Update Document Status
      await prisma.healthDocument.update({
        where: { id: healthDoc.id },
        data: { status: 'EXTRACTED' }
      });
    } catch (extractError) {
      console.error("Extraction failed for document", healthDoc.id, extractError);
      await prisma.healthDocument.update({
        where: { id: healthDoc.id },
        data: { status: 'FAILED' }
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Document upload failed' });
  }
});

// Get Timeline Events
app.get('/api/memory/timeline', authenticateToken, async (req: any, res: any) => {
  const { category, isFuture } = req.query;
  try {
    const profile = await prisma.patientProfile.findUnique({ where: { userId: req.user.userId } });
    if (!profile) return res.status(404).json({ error: 'Patient profile not found' });

    let whereClause: any = { patientId: profile.id };
    if (category) whereClause.eventType = category;
    if (isFuture !== undefined) whereClause.isFuture = isFuture === 'true';

    const events = await prisma.healthEvent.findMany({
      where: whereClause,
      orderBy: { eventDate: 'desc' },
      include: { sourceDocument: true } // Include document data so the user can "View Evidence"
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

// --- AI CHAT ENGINE ---
const OLLAMA_URL = 'http://127.0.0.1:11434';
const OLLAMA_MODEL = 'llama3';

app.post('/api/chat', authenticateToken, async (req: any, res: any) => {
  const { patientId, message } = req.body;
  try {
    // Verify access
    if (req.user.role === 'caregiver') {
      const conn = await prisma.careConnection.findUnique({
        where: { patientId_caregiverId: { patientId, caregiverId: req.user.userId } }
      });
      if (!conn || conn.status !== 'ACCEPTED') return res.status(403).json({ error: 'Not authorized for this patient' });
    } else if (req.user.userId !== patientId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Gather context
    const profile = await prisma.patientProfile.findUnique({ where: { userId: patientId } });
    const events = await prisma.healthEvent.findMany({ where: { patientId: profile?.id } });
    
    const contextStr = JSON.stringify({
      profileDetails: profile,
      healthMemoryEvents: events
    }, null, 2);

    const prompt = `
You are a specialized medical assistant AI for caregivers. 
You are answering a question based ONLY on the following patient health memory data. 
Do not invent information. If the answer is not in the context, say "I don't have that information based on the recorded health memory."

Context Data:
${contextStr}

Caregiver Question: ${message}
`;

    const chatResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false
      })
    });

    if (!chatResponse.ok) {
      throw new Error(`Ollama chat engine failed with status: ${chatResponse.status}`);
    }

    const data = await chatResponse.json();
    const text = data.response || 'I could not generate a response.';
    
    res.json({ reply: text });
  } catch (error) { 
    console.error(error);
    res.status(500).json({ error: 'Chat engine failed' }); 
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
