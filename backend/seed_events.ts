import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const patientId = '848382cf-218c-4f4d-9b29-2a2dd375c6da'; // Fayas MF

  const profile = await prisma.patientProfile.findUnique({
    where: { userId: patientId }
  });

  if (!profile) {
    console.error('Patient profile not found!');
    return;
  }

  // Create some conflicting medications to trigger Polypharmacy risk
  await prisma.healthEvent.create({
    data: {
      patientId: profile.id,
      eventType: 'Medication',
      eventDate: new Date(),
      title: 'Warfarin 5mg',
      description: 'Blood thinner for atrial fibrillation',
      provenance: 'DOCTOR_DOCUMENTED',
      verificationStatus: 'VERIFIED'
    }
  });

  await prisma.healthEvent.create({
    data: {
      patientId: profile.id,
      eventType: 'Medication',
      eventDate: new Date(),
      title: 'Aspirin 325mg',
      description: 'NSAID for pain relief (High bleeding risk when combined with Warfarin)',
      provenance: 'PATIENT_REPORTED',
      verificationStatus: 'VERIFIED'
    }
  });

  // Create some functional decline observations to trigger Decline Trajectory risk
  await prisma.healthEvent.create({
    data: {
      patientId: profile.id,
      eventType: 'Observation',
      eventDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      title: 'Minor Fall',
      description: 'Patient slipped in the bathroom but no severe injuries.',
      provenance: 'CAREGIVER_REPORTED',
      verificationStatus: 'VERIFIED'
    }
  });

  await prisma.healthEvent.create({
    data: {
      patientId: profile.id,
      eventType: 'Observation',
      eventDate: new Date(), // Today
      title: 'Severe confusion and dizziness',
      description: 'Patient could not remember the route to the grocery store. Very dizzy when standing.',
      provenance: 'CAREGIVER_REPORTED',
      verificationStatus: 'VERIFIED'
    }
  });

  console.log('Seeded HealthEvents for patient:', patientId);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
