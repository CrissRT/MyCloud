import { z } from '@server/i18n';

export const folderSchema = z.object({
  id: z.number().int().nonnegative(),
  userId: z.number().int().nonnegative(),
  name: z.string().min(1).max(255),
  sizeBytes: z.number().int().nonnegative(),
  parentFolderId: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isFavorite: z.boolean(),
  isDeleted: z.boolean()
});

export type Folder = z.infer<typeof folderSchema>;
