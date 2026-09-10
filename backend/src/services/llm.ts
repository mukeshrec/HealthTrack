import fs from 'fs';
import path from 'path';
import Tesseract from 'tesseract.js';
const pdfParse = require('pdf-parse');

const OLLAMA_URL = 'http://127.0.0.1:11434';
const OLLAMA_MODEL = 'llama3';

export async function extractHealthEventsFromDocument(filePath: string, mimeType: string, patientId: string) {
  let extractedText = '';

  // Detect actual file type from extension since Blob uploads sometimes report wrong MIME type
  const ext = path.extname(filePath).toLowerCase();
  const detectedMime = 
    ext === '.pdf' ? 'application/pdf' :
    (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' :
    ext === '.png' ? 'image/png' :
    mimeType; // fallback to reported type

  const effectiveMime = (mimeType === 'text/plain' || mimeType === 'application/octet-stream') ? detectedMime : mimeType;

  console.log(`Processing file: ${filePath}, Reported MIME: ${mimeType}, Effective MIME: ${effectiveMime}`);

  try {
    if (effectiveMime === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (effectiveMime.startsWith('image/')) {
      const result = await Tesseract.recognize(filePath, 'eng');
      extractedText = result.data.text;
    } else {
      throw new Error(`Unsupported file type for local OCR: ${effectiveMime} (extension: ${ext})`);
    }
  } catch (err) {
    console.error("OCR/Text Extraction Error:", err);
    throw new Error("Failed to extract text from document.");
  }

  if (!extractedText.trim()) {
    throw new Error("No readable text found in document.");
  }

  const prompt = `
You are a highly accurate medical data extraction assistant. 
Your task is to analyze the following raw text extracted from a medical document via OCR.
Extract all clinically relevant health events. Do NOT invent any information. If something is uncertain, skip it.

RAW TEXT FROM OCR:
"""
${extractedText}
"""

Strictly output an array of JSON objects. Do not include markdown code blocks. Just the array.
Each object MUST have these exact fields:
- eventType: One of ["Condition", "Medication", "Lab", "Hospitalization", "Consultation", "Observation", "Procedure", "Appointment"].
- eventDate: The ISO 8601 date string of when this event occurred or is scheduled to occur. If only year is known, use YYYY-01-01T00:00:00Z. If unknown, use today's date.
- isFuture: boolean. True if this is a planned/upcoming event.
- title: A short, clear title for the event.
- description: Additional context from the document.
- metadata: A JSON object containing specific details depending on the eventType.
`;

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        format: 'json'
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama failed with status: ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.response;
    
    // Parse the JSON array
    const events = JSON.parse(textResponse);
    return events;
  } catch (error) {
    console.error("Local LLaMA Extraction Error:", error);
    throw error;
  }
}
