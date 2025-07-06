-- Enums
CREATE TYPE "roleEnum" AS ENUM ('admin', 'user');
CREATE TYPE "appearanceEnum" AS ENUM ('dark', 'light', 'device');
CREATE TYPE "densityEnum" AS ENUM ('comfortable', 'cosy', 'compact');
CREATE TYPE "openFilesEnum" AS ENUM ('preview', 'newTab');
CREATE TYPE "layoutEnum" AS ENUM ('list', 'grid');
CREATE TYPE "uploadStatusEnum" AS ENUM ('processing', 'ready', 'error');
CREATE TYPE "notificationTypeEnum" AS ENUM ('newPassword', 'newIp', 'newDeviceLogin', 'sharedItems', 'requestAccess');
CREATE TYPE "sexEnum" AS ENUM ('male', 'female', 'other');
CREATE TYPE "languageEnum" AS ENUM ('ro', 'ru', 'en');

-- Users
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "username" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255) CHECK (char_length("firstName") >= 1) NOT NULL,
    "lastName" VARCHAR(255) CHECK (char_length("lastName") >= 1) NOT NULL,
    "birthDate" DATE NOT NULL,
    "role" "roleEnum" NOT NULL DEFAULT 'user',
    "sex" "sexEnum" NOT NULL DEFAULT 'other',
    "profileImage" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE "storage" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER UNIQUE REFERENCES "users"("id") ON DELETE CASCADE NOT NULL,
    "storageSpaceInMB" BIGINT NOT NULL DEFAULT 15360,
    "usedStorageInBytes" BIGINT NOT NULL DEFAULT 0
);

-- Sessions
CREATE TABLE "sessions" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "users"("id") ON DELETE CASCADE NOT NULL,
    "deviceInfo" TEXT NOT NULL,
    "ip" VARCHAR(64) NOT NULL,
    "cookie" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    "lastActive" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "banDurationMinutes" INTEGER,
    "banStart" TIMESTAMP WITH TIME ZONE
);

-- Reset Tokens
CREATE TABLE "resetTokens" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "users"("id") ON DELETE CASCADE NOT NULL,
    "token" TEXT NOT NULL
);

-- General Preferences
CREATE TABLE "preferences" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER UNIQUE REFERENCES "users"("id") ON DELETE CASCADE NOT NULL,
    "appearance" "appearanceEnum" NOT NULL DEFAULT 'device',
    "density" "densityEnum" NOT NULL DEFAULT 'comfortable',
    "openFiles" "openFilesEnum" NOT NULL DEFAULT 'preview',
    "layout" "layoutEnum" NOT NULL DEFAULT 'grid',
    "language" "languageEnum" NOT NULL DEFAULT 'en'
);

-- Notification Preferences
CREATE TABLE "notificationPreferences" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER UNIQUE REFERENCES "users"("id") ON DELETE CASCADE NOT NULL,
    "newlySharedItems" BOOLEAN NOT NULL DEFAULT TRUE,
    "requestsForAccess" BOOLEAN NOT NULL DEFAULT TRUE
);

-- Notifications
CREATE TABLE "notifications" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "users"("id") ON DELETE CASCADE NOT NULL,
    "type" "notificationTypeEnum" NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Files
CREATE TABLE "files" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "users"("id") ON DELETE CASCADE NOT NULL,
    "parentFolderId" INTEGER REFERENCES "folders"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "originalName" VARCHAR(255) NOT NULL,
    "filePath" TEXT NOT NULL,
    "mimeType" VARCHAR(128) NOT NULL,
    "sizeBytes" BIGINT NOT NULL DEFAULT 0,
    "uploadStatus" "uploadStatusEnum" NOT NULL DEFAULT 'processing',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT FALSE,
    "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE
);

-- Files Sharable
CREATE TABLE "filesSharable" (
    "id" SERIAL PRIMARY KEY,
    "fileId" INTEGER REFERENCES "files"("id") ON DELETE CASCADE NOT NULL,
    "shareLink" TEXT NOT NULL,
    "shareLinkExpire" TIMESTAMP WITH TIME ZONE
);

-- Folders
CREATE TABLE "folders" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "users"("id") ON DELETE CASCADE NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sizeBytes" BIGINT NOT NULL DEFAULT 0,
    "parentFolderId" INTEGER REFERENCES "folders"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT FALSE,
    "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE
);
