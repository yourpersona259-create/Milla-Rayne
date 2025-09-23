import * as fs from 'fs';
import path from 'path';

// This is where Milla's user activity will be stored
const USER_ACTIVITY_FILE_PATH = path.join(__dirname, '..', 'memory', 'user_activity.json');

// Ensure the memory directory exists
const ensureMemoryDirExists = () => {
  const dir = path.dirname(USER_ACTIVITY_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/**
 * Interface for user activity tracking.
 */
interface UserActivity {
  lastActive: number;
  lastMessageTimestamp: number;
  conversationCount: number;
}

/**
 * Initializes the user activity tracking.
 */
export const initializeUserActivity = async (): Promise<void> => {
  ensureMemoryDirExists();
  if (!fs.existsSync(USER_ACTIVITY_FILE_PATH)) {
    const initialData: UserActivity = {
      lastActive: Date.now(),
      lastMessageTimestamp: Date.now(),
      conversationCount: 0,
    };
    fs.writeFileSync(USER_ACTIVITY_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
  }
};

/**
 * Processes a new user activity event to update our records.
 */
export const processUserActivity = (): void => {
  try {
    let activity: UserActivity = fs.existsSync(USER_ACTIVITY_FILE_PATH) 
      ? JSON.parse(fs.readFileSync(USER_ACTIVITY_FILE_PATH, 'utf-8'))
      : { lastActive: Date.now(), lastMessageTimestamp: Date.now(), conversationCount: 0 };

    activity.lastActive = Date.now();
    activity.lastMessageTimestamp = Date.now();
    activity.conversationCount++;

    fs.writeFileSync(USER_ACTIVITY_FILE_PATH, JSON.stringify(activity, null, 2), 'utf-8');
    console.log('User activity processed successfully.');
  } catch (error) {
    console.error('Error processing user activity:', error);
  }
};

/**
 * Checks for proactive messages based on user inactivity.
 * @returns A proactive message string or null.
 */
export const checkForProactiveMessage = (): string | null => {
  // This is a placeholder for more advanced proactive logic
  try {
    const activity: UserActivity = fs.existsSync(USER_ACTIVITY_FILE_PATH)
      ? JSON.parse(fs.readFileSync(USER_ACTIVITY_FILE_PATH, 'utf-8'))
      : { lastActive: 0, lastMessageTimestamp: 0, conversationCount: 0 };
    
    const currentTime = Date.now();
    const inactivityThreshold = 15 * 60 * 1000; // 15 minutes
    
    if (activity.lastActive > 0 && (currentTime - activity.lastActive) > inactivityThreshold) {
      return "It's been a little while since we last spoke. Is there anything on your mind, love?";
    }
  } catch (error) {
    console.error('Error checking for proactive message:', error);
  }
  return null;
};