import crypto from 'crypto';
import dayjs from 'dayjs';
import fs from 'fs/promises';
import path from 'path';

import { DEFAULT_STORAGE_SPACE_IN_MB, UPLOADS_BASE_DIR } from './constants';

export const initializeUploadsDirectory = async (): Promise<void> => {
  try {
    await fs.mkdir(UPLOADS_BASE_DIR, { recursive: true });
    console.log(`Uploads directory initialized at: ${UPLOADS_BASE_DIR}`);
  } catch (error) {
    console.error('Failed to initialize uploads directory:', error);
  }
};

export const ensureUserUploadsDir = async (username: string): Promise<string> => {
  const userDir = path.join(UPLOADS_BASE_DIR, username);

  try {
    await fs.access(userDir);
  } catch {
    await fs.mkdir(userDir, { recursive: true });
  }

  return userDir;
};

export const generateUniqueFilename = (originalFilename: string): string => {
  const ext = path.extname(originalFilename);
  const name = path.basename(originalFilename, ext);
  const timestamp = dayjs().valueOf();
  const randomStr = crypto.randomBytes(8).toString('hex');

  return `${name}_${timestamp}_${randomStr}${ext}`;
};

export const saveUserFile = async (username: string, filename: string, fileBuffer: Buffer, subFolder?: string) => {
  const userDir = await ensureUserUploadsDir(username);

  let targetDir = userDir;
  if (subFolder) {
    targetDir = path.join(userDir, subFolder);
    await fs.mkdir(targetDir, { recursive: true });
  }

  const uniqueFilename = generateUniqueFilename(filename);
  const filePath = path.join(targetDir, uniqueFilename);

  await fs.writeFile(filePath, fileBuffer);

  const relativePath = path.relative(UPLOADS_BASE_DIR, filePath);

  return {
    filePath,
    relativePath,
    filename: uniqueFilename,
    originalFilename: filename
  };
};

export const saveProfileImage = async (username: string, filename: string, fileBuffer: Buffer) =>
  saveUserFile(username, filename, fileBuffer, 'profile');

export const getUserFilePath = (username: string, relativePath: string) =>
  path.join(UPLOADS_BASE_DIR, username, relativePath);

export const getUserFileUrl = (username: string, relativePath: string) => `/uploads/${username}/${relativePath}`;

export const userFileExists = async (username: string, relativePath: string) => {
  const filePath = getUserFilePath(username, relativePath);

  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

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

export const deleteAllUserFiles = async (username: string) => {
  const userDir = path.join(UPLOADS_BASE_DIR, username);

  try {
    await fs.rm(userDir, { recursive: true, force: true });
  } catch (error) {
    console.warn(`Failed to delete user directory: ${userDir}`, error);
  }
};

export const isValidProfileImageType = (mimeType: string) => mimeType.toLowerCase().includes('image/');

/**
 * Validates file size
 * @param sizeBytes - File size in bytes
 * @returns Boolean indicating if file size is within limits
 */
export const isValidFileSize = (sizeBytes: number) => BigInt(sizeBytes) <= DEFAULT_STORAGE_SPACE_IN_MB * 1024n * 1024n;

/**
 * Generates a default profile image with user initials
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param username - User's username (used for filename)
 * @returns File path information for the generated image
 */
export const generateDefaultProfileImage = async (firstName: string, lastName: string, username: string) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

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

  const userDir = await ensureUserUploadsDir(username);
  const profileDir = path.join(userDir, 'profile');
  await fs.mkdir(profileDir, { recursive: true });

  const filename = `default_avatar_${dayjs().valueOf()}.png`;
  const filePath = path.join(profileDir, filename);

  await fs.writeFile(filePath, svgContent, 'utf8');

  return filename;
};

export const getProfileImageInBase64 = async (username: string, filename: string): Promise<string> => {
  const filePath = path.join(UPLOADS_BASE_DIR, username, 'profile', filename);
  try {
    const fileBuffer = await fs.readFile(filePath);
    return fileBuffer.toString('base64');
  } catch {
    return '';
  }
};
