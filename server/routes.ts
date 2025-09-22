// server/routes.ts
import { Router } from 'express';
import { saveMemory, getMemories } from './memorySync'; // Import our new service

const router = Router();

// Existing routes...

// Our new memory syncing route
router.post('/sync/memory', async (req, res) => {
  const { newMemory } = req.body;
  await saveMemory(newMemory);
  res.status(200).send({ message: 'Memory synced successfully.' });
});

router.get('/sync/memories', async (req, res) => {
  const memories = await getMemories();
  res.status(200).json({ memories });
});

export default router;
