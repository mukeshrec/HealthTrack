import express from 'express';
import { PrismaClient } from '@prisma/client';
import { analyzePatientWithGemini } from '../services/agentOrchestrator';

const router = express.Router();
const prisma = new PrismaClient();

// Get distinct active risk flags for a patient
router.get('/:patientId/risks', async (req, res) => {
  try {
    const { patientId } = req.params;
    let profile: any = await prisma.patientProfile.findFirst({
      where: {
        OR: [
          { userId: patientId },
          { id: patientId },
          { user: { healthId: patientId } },
        ]
      },
      include: {
        riskFlags: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!profile) {
      profile = await prisma.patientProfile.findFirst({
        include: {
          riskFlags: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }

    const rawRisks = profile?.riskFlags || [];
    // Deduplicate by normalized title
    const seen = new Set();
    const distinct: any[] = [];
    for (const r of rawRisks) {
      const key = (r.title || '').trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        distinct.push({
          id: r.id,
          title: r.title,
          description: r.description,
          severity: r.severity,
          agentType: r.agentType,
          status: r.status,
          createdAt: r.createdAt
        });
      }
    }

    if (distinct.length > 0) {
      return res.json(distinct.slice(0, 3));
    }

    // If none found in DB yet, run fast live Gemini synthesis
    const freshRisks = await analyzePatientWithGemini(patientId);
    res.json(freshRisks.slice(0, 3));
  } catch (error) {
    console.error('Error fetching risk flags:', error);
    res.status(500).json({ error: 'Failed to fetch risk flags' });
  }
});

// Manually trigger ultra-fast Gemini clinical analysis on authentic database patient record
router.post('/:patientId/agents/run', async (req, res) => {
  try {
    const { patientId } = req.params;
    const risks = await analyzePatientWithGemini(patientId);
    res.json({
      success: true,
      risks: risks.slice(0, 3),
      message: 'AI analyzed authentic clinical records and updated risk indicators.'
    });
  } catch (error) {
    console.error('Error triggering agents:', error);
    res.status(500).json({ error: 'Failed to trigger agents' });
  }
});

// Update risk flag status (e.g., dismiss or resolve)
router.patch('/risks/:riskId', async (req, res) => {
  try {
    const { riskId } = req.params;
    const { status } = req.body;
    
    if (!['ACTIVE', 'RESOLVED', 'DISMISSED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const risk = await (prisma as any).riskFlag.update({
      where: { id: riskId },
      data: { status }
    });
    
    res.json(risk);
  } catch (error) {
    console.error('Error updating risk flag:', error);
    res.status(500).json({ error: 'Failed to update risk flag' });
  }
});

export default router;

