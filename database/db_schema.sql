-- Enums
CREATE TYPE role_enum AS ENUM ('admin', 'user');
CREATE TYPE appearance_enum AS ENUM ('dark', 'light', 'device');
CREATE TYPE density_enum AS ENUM ('comfortable', 'cosy', 'compact');
CREATE TYPE open_files_enum AS ENUM ('preview', 'newTab');
CREATE TYPE layout_enum AS ENUM ('list', 'grid');
CREATE TYPE upload_status_enum AS ENUM ('processing', 'ready', 'error');
CREATE TYPE notification_type_enum AS ENUM ('newPassword', 'newIp', 'newDeviceLogin', 'sharedItems', 'requestAccess');
CREATE TYPE sex_enum AS ENUM ('male', 'female', 'other');
CREATE TYPE language_enum AS ENUM ('ro', 'ru', 'en');

-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) CHECK (char_length(first_name) >= 3),
    last_name VARCHAR(255) CHECK (char_length(last_name) >= 3),
    birth_date DATE,
    role role_enum NOT NULL DEFAULT 'user',
    sex sex_enum,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sessions
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    device_info TEXT,
    ip VARCHAR(64),
    cookie TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT now(),
    login_attempts INTEGER NOT NULL DEFAULT 0,
    ban_duration_minutes INTEGER,
    ban_start TIMESTAMP WITH TIME ZONE
);

-- General Preferences
CREATE TABLE preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    appearance appearance_enum NOT NULL DEFAULT 'device',
    density density_enum NOT NULL DEFAULT 'comfortable',
    open_files open_files_enum NOT NULL DEFAULT 'preview',
    layout layout_enum NOT NULL DEFAULT 'grid',
    language language_enum NOT NULL DEFAULT 'en'
);

-- Notification Preferences
CREATE TABLE notification_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    newly_shared_items BOOLEAN NOT NULL DEFAULT TRUE,
    requests_for_access BOOLEAN NOT NULL DEFAULT TRUE
);

-- Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type notification_type_enum NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Files
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    parent_folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    mime_type VARCHAR(128) NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    upload_status upload_status_enum NOT NULL DEFAULT 'processing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Files Sharable
CREATE TABLE files_sharable (
    id SERIAL PRIMARY KEY,
    file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
    share_link TEXT NOT NULL,
    share_link_expire TIMESTAMP WITH TIME ZONE
);

-- Folders
CREATE TABLE folders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    parent_folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);
