// Helper: Convert snake_case to camelCase
export const snakeToCamel = (s: string) => s.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

export const convertObjectKeysSnakeCaseToCamelCase = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertObjectKeysSnakeCaseToCamelCase(item)) as T;
  } else if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    const result: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = snakeToCamel(key);
        const value = (obj as Record<string, unknown>)[key];
        result[camelKey] = convertObjectKeysSnakeCaseToCamelCase(value);
      }
    }
    return result as T;
  }
  return obj;
};

export const convertBytesToMB = (bytes: bigint | number) => BigInt(bytes) / BigInt(1024 * 1024);

export const convertMBToBytes = (mb: bigint | number) => BigInt(mb) * BigInt(1024 * 1024);

export const convertMBToGB = (mb: bigint | number) => BigInt(mb) / BigInt(1024);

export const convertGBToMB = (gb: bigint | number) => BigInt(gb) * BigInt(1024);

export const convertGBToBytes = (gb: bigint | number) => BigInt(gb) * BigInt(1024 * 1024 * 1024);

export const convertBytesToGB = (bytes: bigint | number) => BigInt(bytes) / BigInt(1024 * 1024 * 1024);

export const sanitizeNameForDatabase = (name: string, fallback: string = 'User'): string => {
  const cleanName = name.trim();

  // If name is less than 3 characters, pad it or use fallback
  if (cleanName.length < 3) {
    if (cleanName.length === 2)
      return cleanName + 'X'; // Pad with X to reach 3 characters
    else if (cleanName.length === 1)
      return cleanName + 'XX'; // Pad with XX to reach 3 characters
    else return fallback; // Use fallback if empty
  }

  return cleanName;
};

export const convertMimeTypeToFileExtension = (mimeType: string): string => {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp'
  };

  return mimeToExt[mimeType.toLowerCase()] || '.jpg'; // Default to .jpg if unknown
};
