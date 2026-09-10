import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GCP_API_KEY || '';

/**
 * Generic helper to call Gemini and ensure JSON output.
 */
async function callGeminiJSON(prompt: string): Promise<any> {
  if (!GEMINI_API_KEY) {
    console.warn('[Gemini AI] No GEMINI_API_KEY configured for Agents.');
    return null;
  }

  const model = 'gemini-3.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errorText.slice(0, 180)}`);
    }

    const data = await response.json();
    const rawTextResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (rawTextResponse) {
      return JSON.parse(rawTextResponse.trim());
    }
  } catch (error) {
    console.error('[Agent Orchestrator] Failed to execute Gemini JSON call:', error);
  }
  return null;
}

/**
 * Polypharmacy Agent: Analyzes active medications for severe interactions or inappropriate age-related dosages.
 */
export async function runPolypharmacyAgent(patientId: string) {
  console.log(`[Agent: Polypharmacy] Running for patient ${patientId}...`);
  
  const profile = await prisma.patientProfile.findUnique({
    where: { userId: patientId },
    include: {
      events: {
        where: { eventType: 'Medication' },
        orderBy: { eventDate: 'desc' },
      },
    },
  });

  if (!profile || profile.events.length === 0) {
    console.log('[Agent: Polypharmacy] No active medications found.');
    return;
  }

  const medications = profile.events.map(e => `${e.title} - ${e.description}`).join('\n');

  const prompt = `
You are a specialized Geriatric Clinical Pharmacologist AI Agent.
Analyze the following patient profile and current medication list for dangerous drug-drug interactions, high anticholinergic burden, or medications considered inappropriate for the elderly (Beers Criteria).

Patient Profile:
Conditions: ${profile.existingConditions.join(', ') || 'None'}
Allergies: ${profile.allergies.join(', ') || 'None'}

Current Medications:
${medications}

If you identify a significant risk (HIGH or CRITICAL severity), output a JSON object with the flag details. If no significant risk is found, return null.

STRICT JSON SCHEMA:
{
  "hasRisk": boolean,
  "severity": "HIGH" | "CRITICAL",
  "title": "Short title of the risk (e.g., 'Severe Bleeding Risk', 'High Anticholinergic Burden')",
  "description": "Detailed explanation of the interaction and recommended clinical action."
}
`;

  const result = await callGeminiJSON(prompt);

  if (result && result.hasRisk) {
    await (prisma as any).riskFlag.create({
      data: {
        patientId: profile.id,
        agentType: 'POLYPHARMACY',
        severity: result.severity,
        title: result.title,
        description: result.description,
        status: 'ACTIVE',
      },
    });
    console.log(`[Agent: Polypharmacy] Risk detected and flagged: ${result.title}`);
  } else {
    console.log('[Agent: Polypharmacy] No significant risks detected.');
  }
}

/**
 * Decline Trajectory Agent: Analyzes recent observations and conditions for signs of cognitive or functional decline.
 */
export async function runDeclineTrajectoryAgent(patientId: string) {
  console.log(`[Agent: Decline Trajectory] Running for patient ${patientId}...`);
  
  const profile = await prisma.patientProfile.findUnique({
    where: { userId: patientId },
    include: {
      events: {
        where: { 
          eventType: { in: ['Observation', 'Condition'] }
        },
        orderBy: { eventDate: 'desc' },
        take: 20, // look at recent history
      },
    },
  });

  if (!profile || profile.events.length === 0) {
    return;
  }

  const timeline = profile.events.map(e => `[${new Date(e.eventDate).toISOString().split('T')[0]}] ${e.eventType}: ${e.title} - ${e.description}`).join('\n');

  const prompt = `
You are a specialized Geriatric Care Management AI Agent.
Analyze the following recent timeline of patient events (observations, conditions) to detect patterns of functional decline, increased fall risk, or cognitive deterioration over time.

Recent Timeline:
${timeline}

If you detect a meaningful negative trajectory (e.g., multiple falls in a short period, increasing confusion), output a JSON object with the flag details. If stable, return null.

STRICT JSON SCHEMA:
{
  "hasRisk": boolean,
  "severity": "MEDIUM" | "HIGH" | "CRITICAL",
  "title": "Short title of the trajectory risk (e.g., 'Accelerated Functional Decline', 'Increasing Fall Frequency')",
  "description": "Detailed explanation of the observed pattern and why it requires attention."
}
`;

  const result = await callGeminiJSON(prompt);

  if (result && result.hasRisk) {
    await (prisma as any).riskFlag.create({
      data: {
        patientId: profile.id,
        agentType: 'DECLINE_TRAJECTORY',
        severity: result.severity,
        title: result.title,
        description: result.description,
        status: 'ACTIVE',
      },
    });
    console.log(`[Agent: Decline Trajectory] Risk detected and flagged: ${result.title}`);
  } else {
    console.log('[Agent: Decline Trajectory] Patient trajectory appears stable.');
  }
}

/**
 * Triggers all active agents for a specific patient.
 */
export async function runAllAgents(patientId: string) {
  console.log(`[Agent Orchestrator] Triggering all agents for patient ${patientId}`);
  // Run asynchronously without awaiting so the main thread isn't blocked
  Promise.all([
    runPolypharmacyAgent(patientId),
    runDeclineTrajectoryAgent(patientId)
  ]).catch(err => console.error('[Agent Orchestrator] Error running agents:', err));
}
