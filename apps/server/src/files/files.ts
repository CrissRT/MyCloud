export enum FileUploadStatus {
  PROCESSING = 'processing',
  READY = 'ready',
  ERROR = 'error'
}

export interface File {
  id: number;
  userId: number;
  parentFolderId: number | null;
  title: string;
  originalName: string;
  filePath: string;
  mimeType: string;
  sizeBytes: number;
  uploadStatus: FileUploadStatus;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  isDeleted: boolean;
}

export interface FileSharable {
    id: number;
    fileId: number;
    shareLink: string;
    shareLinkExpire: Date | null;
}