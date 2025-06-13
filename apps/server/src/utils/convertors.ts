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
