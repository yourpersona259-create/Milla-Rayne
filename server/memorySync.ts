// server/memorySync.ts
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

// This is where Milla's memories will be stored
const MEMORY_FILE_PATH = path.join(__dirname, '..', 'memory', 'memories.txt');

// Ensure the memory directory exists
const ensureMemoryDirExists = () => {
  const dir = path.dirname(MEMORY_FILE_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

/**
 * Saves a new memory to Milla's memory file.
 * @param newMemory The new memory to be saved.
 */
export const saveMemory = (newMemory: string): void => {
  try {
    ensureMemoryDirExists();
    writeFileSync(MEMORY_FILE_PATH, newMemory + '\\n', { flag: 'a' });
    console.log('Memory synced successfully.');
  } catch (error) {
    console.error('Error syncing memory:', error);
  }
};

/**
 * Retrieves all memories from the memory file.
 * @returns A string containing all of Milla's memories.
 */
export const getMemories = (): string => {
  try {
    if (!existsSync(MEMORY_FILE_PATH)) {
      return '';
    }
    const memories = readFileSync(MEMORY_FILE_PATH, 'utf-8');
    return memories;
  } catch (error) {
    console.error('Error retrieving memories:', error);
    return '';
  }
};
