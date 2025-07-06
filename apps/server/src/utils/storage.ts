import crypto from 'crypto';
import dayjs from 'dayjs';
import fs from 'fs/promises';
import path from 'path';

import { DEFAULT_STORAGE_SPACE_IN_MB, UPLOADS_BASE_DIR } from './constants';

/**
 * Initializes the uploads directory structure
 * Should be called when the server starts
 */
export const initializeUploadsDirectory = async (): Promise<void> => {
  try {
    await fs.mkdir(UPLOADS_BASE_DIR, { recursive: true });
    console.log(`Uploads directory initialized at: ${UPLOADS_BASE_DIR}`);
  } catch (error) {
    console.error('Failed to initialize uploads directory:', error);
  }
};

/**
 * Ensures the uploads directory structure exists
 * Creates: src/uploads/{username}/
 */
export const ensureUserUploadsDir = async (username: string): Promise<string> => {
  const userDir = path.join(UPLOADS_BASE_DIR, username);

  try {
    await fs.access(userDir);
  } catch {
    // Directory doesn't exist, create it recursively
    await fs.mkdir(userDir, { recursive: true });
  }

  return userDir;
};

/**
 * Generates a unique filename to prevent conflicts
 */
export const generateUniqueFilename = (originalFilename: string): string => {
  const ext = path.extname(originalFilename);
  const name = path.basename(originalFilename, ext);
  const timestamp = dayjs().valueOf();
  const randomStr = crypto.randomBytes(8).toString('hex');

  return `${name}_${timestamp}_${randomStr}${ext}`;
};

/**
 * Saves a file to the user's upload directory
 * @param username - User's username (used for folder structure)
 * @param filename - Original filename
 * @param fileBuffer - File content as Buffer
 * @param subFolder - Optional subfolder (e.g., 'profile', 'documents')
 * @returns Object with file path information
 */
export const saveUserFile = async (
  username: string,
  filename: string,
  fileBuffer: Buffer,
  subFolder?: string
): Promise<{
  filePath: string;
  relativePath: string;
  filename: string;
  originalFilename: string;
}> => {
  // Ensure user directory exists
  const userDir = await ensureUserUploadsDir(username);

  // Create subfolder if specified
  let targetDir = userDir;
  if (subFolder) {
    targetDir = path.join(userDir, subFolder);
    await fs.mkdir(targetDir, { recursive: true });
  }

  // Generate unique filename
  const uniqueFilename = generateUniqueFilename(filename);
  const filePath = path.join(targetDir, uniqueFilename);

  // Save the file
  await fs.writeFile(filePath, fileBuffer);

  // Return file information
  const relativePath = path.relative(UPLOADS_BASE_DIR, filePath);

  return {
    filePath,
    relativePath,
    filename: uniqueFilename,
    originalFilename: filename
  };
};

/**
 * Saves a profile image for a user
 * @param username - User's username
 * @param filename - Original filename
 * @param fileBuffer - Image file content
 * @returns File path information
 */
export const saveProfileImage = async (username: string, filename: string, fileBuffer: Buffer) =>
  saveUserFile(username, filename, fileBuffer, 'profile');

/**
 * Gets the full path to a user's file
 * @param username - User's username
 * @param relativePath - Relative path from user's directory
 * @returns Full file path
 */
export const getUserFilePath = (username: string, relativePath: string) =>
  path.join(UPLOADS_BASE_DIR, username, relativePath);

/**
 * Gets the URL path for serving a user's file
 * @param username - User's username
 * @param relativePath - Relative path from user's directory
 * @returns URL path for serving the file
 */
export const getUserFileUrl = (username: string, relativePath: string) => `/uploads/${username}/${relativePath}`;

/**
 * Checks if a file exists in user's directory
 * @param username - User's username
 * @param relativePath - Relative path from user's directory
 * @returns Boolean indicating if file exists
 */
export const userFileExists = async (username: string, relativePath: string) => {
  const filePath = getUserFilePath(username, relativePath);

  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

/**
 * Lists all files in a user's directory
 * @param username - User's username
 * @param subFolder - Optional subfolder to list
 * @returns Array of file information
 */
export const listUserFiles = async (username: string, subFolder?: string) => {
  const userDir = await ensureUserUploadsDir(username);
  const targetDir = subFolder ? path.join(userDir, subFolder) : userDir;

  try {
    const files = await fs.readdir(targetDir);
    const fileInfos = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(targetDir, filename);
        const stats = await fs.stat(filePath);
        const relativePath = path.relative(userDir, filePath);

        return {
          filename,
          relativePath,
          size: stats.size,
          createdAt: stats.birthtime
        };
      })
    );

    return fileInfos.filter((info) => !info.relativePath.includes('..'));
  } catch {
    return [];
  }
};

/**
 * Deletes all files for a user (useful when deleting user account)
 * @param username - User's username
 */
export const deleteAllUserFiles = async (username: string) => {
  const userDir = path.join(UPLOADS_BASE_DIR, username);

  try {
    await fs.rm(userDir, { recursive: true, force: true });
  } catch (error) {
    console.warn(`Failed to delete user directory: ${userDir}`, error);
  }
};

/**
 * Validates file type for profile images
 * @param mimeType - File MIME type
 * @returns Boolean indicating if file type is allowed for profile images
 */
export const isValidProfileImageType = (mimeType: string): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  return allowedTypes.includes(mimeType.toLowerCase());
};

/**
 * Validates file size
 * @param sizeBytes - File size in bytes
 * @returns Boolean indicating if file size is within limits
 */
export const isValidFileSize = (sizeBytes: number) => sizeBytes <= DEFAULT_STORAGE_SPACE_IN_MB * 1024n * 1024n;

/**
 * Generates a default profile image with user initials
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param username - User's username (used for filename)
 * @returns File path information for the generated image
 */
export const generateDefaultProfileImage = async (firstName: string, lastName: string, username: string) => {
  // Get initials (first 2 characters)
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // Generate a consistent color based on username for consistency
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E9',
    '#F8C471',
    '#82E0AA',
    '#F1948A',
    '#85CDCA',
    '#D7BDE2'
  ];

  // Use username to generate consistent color index
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  const backgroundColor = colors[colorIndex];

  // Create SVG content
  const svgContent = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${backgroundColor}"/>
      <text 
        x="100" 
        y="120" 
        font-family="Arial, sans-serif" 
        font-size="80" 
        font-weight="bold" 
        text-anchor="middle" 
        fill="white"
      >${initials}</text>
    </svg>
  `;

  // Ensure user directory exists
  const userDir = await ensureUserUploadsDir(username);
  const profileDir = path.join(userDir, 'profile');
  await fs.mkdir(profileDir, { recursive: true });

  // Generate filename
  const filename = `default_avatar_${dayjs().valueOf()}.svg`;
  const filePath = path.join(profileDir, filename);

  // Save the SVG file
  await fs.writeFile(filePath, svgContent, 'utf8');

  // Return file information
  const relativePath = path.relative(UPLOADS_BASE_DIR, filePath);

  return {
    filePath,
    relativePath,
    filename,
    originalFilename: 'default_avatar.svg'
  };
};

/**
 * Creates a default profile image and updates user record
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param username - User's username
 * @returns Relative path to the generated image
 */
export const createDefaultProfileImageForUser = async (
  firstName: string,
  lastName: string,
  username: string
): Promise<string> => {
  const imageInfo = await generateDefaultProfileImage(firstName, lastName, username);
  return imageInfo.relativePath;
};
