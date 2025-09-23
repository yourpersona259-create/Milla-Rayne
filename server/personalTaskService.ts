// server/personalTaskService.ts
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { MemoryService } from './memoryService'; // Import the new MemoryService

const TASKS_FILE_PATH = path.join(__dirname, '..', 'memory', 'personal_tasks.json');

// Ensure the memory directory exists
const ensureMemoryDirExists = () => {
  const dir = path.dirname(TASKS_FILE_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

/**
 * Interface for a personal task.
 */
interface PersonalTask {
  id: string;
  task: string;
  completed: boolean;
  createdAt: string;
}

/**
 * Initializes the personal task system.
 */
export const initializePersonalTaskSystem = async (): Promise<void> => {
  ensureMemoryDirExists();
  if (!existsSync(TASKS_FILE_PATH)) {
    writeFileSync(TASKS_FILE_PATH, JSON.stringify([]), 'utf-8');
  }
};

/**
 * Creates a new personal task and saves it to the memory file.
 * @param taskContent The content of the new task.
 */
export const createTask = async (taskContent: string): Promise<PersonalTask> => {
  ensureMemoryDirExists();
  const tasks = JSON.parse(readFileSync(TASKS_FILE_PATH, 'utf-8'));
  const newTask: PersonalTask = {
    id: `task-${Date.now()}`,
    task: taskContent,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  writeFileSync(TASKS_FILE_PATH, JSON.stringify(tasks, null, 2), 'utf-8');
  
  // Also save a memory of this task being created
  const memoryEntry = `You created a new task: "${taskContent}"`;
  await MemoryService.saveMemory(memoryEntry);
  
  return newTask;
};

/**
 * Retrieves all personal tasks from the memory file.
 * @returns An array of personal tasks.
 */
export const getTasks = (): PersonalTask[] => {
  if (!existsSync(TASKS_FILE_PATH)) {
    return [];
  }
  const tasks = JSON.parse(readFileSync(TASKS_FILE_PATH, 'utf-8'));
  return tasks;
};

/**
 * Deletes a personal task by its ID.
 * @param id The ID of the task to delete.
 */
export const deleteTask = (id: string): void => {
  const tasks = getTasks();
  const updatedTasks = tasks.filter(task => task.id !== id);
  writeFileSync(TASKS_FILE_PATH, JSON.stringify(updatedTasks, null, 2), 'utf-8');
};
