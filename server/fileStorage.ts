import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory in an ES Module-compatible way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This is where images will be stored
const ASSETS_PATH = path.join(__dirname, '..', 'attached_assets');

// Ensure the assets directory exists
const ensureAssetsDirExists = () => {
  if (!fs.existsSync(ASSETS_PATH)) {
    fs.mkdirSync(ASSETS_PATH, { recursive: true });
  }
};

/**
 * Stores an image from base64 data to a file.
 * @param base64Data The base64 string of the image.
 * @returns The file path of the stored image.
 */
export const storeImage = async (base64Data: string): Promise<string> => {
  ensureAssetsDirExists();
  const filePath = path.join(ASSETS_PATH, `image_${Date.now()}.png`);
  
  // Remove the data URI part if it exists
  const base64Image = base64Data.split(';base64,').pop() || base64Data;
  
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, base64Image, 'base64', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(filePath);
      }
    });
  });
};