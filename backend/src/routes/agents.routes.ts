import express from 'express';
import { PrismaClient } from '@prisma/client';
import { runAllAgents } from '../services/agentOrchestrator';

const router = express.Router();
const prisma = new PrismaClient();

// Get all active risk flags for a patient
router.get('/:patientId/risks', async (req, res) => {
  try {
    const { patientId } = req.params;
    const profile = await prisma.patientProfile.findUnique({ where: { userId: patientId } });
    if (!profile) return res.json([]);

    const risks = await prisma.riskFlag.findMany({
      where: { 
        patientId: profile.id,
        status: 'ACTIVE'
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(risks);
  } catch (error) {
    console.error('Error fetching risk flags:', error);
    res.status(500).json({ error: 'Failed to fetch risk flags' });
  }
});

// Manually trigger agents for a patient
router.post('/:patientId/agents/run', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Fire and forget (runs asynchronously)
    runAllAgents(patientId);
    
    res.json({ message: 'Agents triggered successfully. Risks will be updated in the background.' });
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

    const risk = await prisma.riskFlag.update({
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
