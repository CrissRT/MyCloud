import { z } from '@server/i18n';

export enum FileUploadStatus {
  PROCESSING = 'processing',
  READY = 'ready',
  ERROR = 'error'
}

export const fileSchema = z.object({
  id: z.number().int().nonnegative(),
  userId: z.number().int().nonnegative(),
  parentFolderId: z.number().int().nullable(),
  name: z.string().min(1).max(255),
  originalName: z.string().min(1).max(255),
  filePath: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  uploadStatus: z.nativeEnum(FileUploadStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
  isFavorite: z.boolean(),
  isDeleted: z.boolean()
});

export type File = z.infer<typeof fileSchema>;

export const fileSharableSchema = z.object({
  id: z.number().int().nonnegative(),
  fileId: z.number().int().nonnegative(),
  shareLink: z.string().min(1),
  shareLinkExpire: z.date().nullable()
});

export type FileSharable = z.infer<typeof fileSharableSchema>;
