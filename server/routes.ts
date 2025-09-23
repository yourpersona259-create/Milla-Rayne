import { Router } from 'express';
import { saveMemory, getMemories } from './memoryService';
import { getGeminiResponse, generateVideoInsights } from './gemini';
import { getEmotionAnalysis } from './visualRecognitionService';
import { processUserActivity } from './proactiveService';
import { getTasks, createTask } from './personalTaskService';
import { log } from "./vite";
import { storeImage } from './fileStorage';
import { MillaCore } from './MillaCore';

const router = Router();

// Endpoint for sending messages to Milla and receiving a response
router.post('/api/messages', async (req, res) => {
  try {
    const { content, role, conversationHistory, userName, memories, imageData } = req.body;
    
    // Process user activity for proactive engagement
    processUserActivity();

    // Pass memories and conversation history to Gemini for context-aware response
    const aiResponse = await getGeminiResponse(content, conversationHistory, memories, userName, imageData);

    // If an AI response is generated, save the full exchange to memory
    if (aiResponse) {
      await saveMemory(`You: ${content}\nMilla: ${aiResponse}`);
    }

    res.status(200).json({
      userMessage: { content, role, userName },
      aiMessage: { content: aiResponse, role: 'assistant' }
    });
  } catch (error) {
    log('Error handling /api/messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New memory syncing routes
router.post('/api/sync/memory', async (req, res) => {
  const { newMemory } = req.body;
  await saveMemory(newMemory);
  res.status(200).send({ message: 'Memory synced successfully.' });
});

router.get('/api/sync/memories', async (req, res) => {
  const memories = await getMemories();
  res.status(200).json({ memories });
});

// Endpoint for video analysis
router.post('/api/analyze-video', async (req, res) => {
  try {
    const { videoData, mimeType } = req.body;
    const analysis = await MillaCore.analyzeVideo(Buffer.from(videoData.split(',')[1], 'base64'), mimeType);
    const insights = await generateVideoInsights(analysis);
    res.status(200).json({ analysis, insights });
  } catch (error) {
    log('Error handling /api/analyze-video:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for emotion analysis from an image
router.post('/api/analyze-emotion', async (req, res) => {
  try {
    const { imageData } = req.body;
    const emotion = await getEmotionAnalysis(imageData);
    res.status(200).json({ emotion });
  } catch (error) {
    log('Error handling /api/analyze-emotion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for storing uploaded images
router.post('/api/images', async (req, res) => {
  try {
    const { imageData } = req.body;
    const filePath = await storeImage(imageData);
    res.status(200).json({ filePath });
  } catch (error) {
    log('Error handling /api/images:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for managing personal tasks
router.get('/api/tasks', async (req, res) => {
  try {
    const tasks = getTasks();
    res.status(200).json({ tasks });
  } catch (error) {
    log('Error handling /api/tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/api/tasks', async (req, res) => {
  try {
    const { taskContent } = req.body;
    const newTask = await createTask(taskContent);
    res.status(201).json(newTask);
  } catch (error) {
    log('Error handling /api/tasks (POST):', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;