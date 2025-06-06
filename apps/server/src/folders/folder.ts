export interface Folder {
  id: number;
  userId: number;
  name: string;
  sizeBytes: number;
  parentFolderId: number | null;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  isDeleted: boolean;
}
