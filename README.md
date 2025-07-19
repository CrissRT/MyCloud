# My Cloud

A personal/enterprise cloud storage solution built with modern web technologies.

## Project Summary

This project is a full-stack personal cloud storage solution that enables users to securely store, manage, and access their files online. The system provides a complete cloud storage experience with robust authentication, file management, and internationalization features.

### Tech Stack

- **Frontend:** Next.js 15 (React 19) with TypeScript
- **Backend:** Express.js with Prisma ORM and PostgreSQL
- **Database:** PostgreSQL with Prisma migrations
- **Authentication:** Cookie-based sessions with Google OAuth integration
- **Styling:** TailwindCSS with dark/light theme support
- **Internationalization:** i18next with support for English, Romanian, and Russian
- **File Storage:** Local file system with organized user directories
- **Development:** TypeScript, ESLint, Prettier, Husky, Commitlint

## Features

### 🔐 Authentication & Security

- **User Registration & Login:** Secure email/password authentication
- **Google OAuth Integration:** Single sign-on with Google accounts
- **Session Management:** Cookie-based sessions with device tracking
- **Account Security:** Progressive lockout system with ban tiers
- **Password Reset:** Email-based password recovery
- **User Profiles:** Customizable profile images with auto-generated avatars

### 📁 File Management

- **File Upload/Download:** Secure file handling with MIME type validation
- **Storage Quotas:** 15GB default storage per user with usage tracking
- **File Organization:** Folder-based file structure
- **File Sharing:** Shareable links with expiration dates
- **File Operations:** Rename, delete, move, and organize files
- **Storage Monitoring:** Real-time storage usage tracking

### 🌍 Internationalization

- **Multi-language Support:** English, Romanian, and Russian
- **Dynamic Language Switching:** Runtime language changes
- **Localized Content:** All UI elements and error messages
- **Server-side i18n:** Consistent translations across client and server

### 🎨 User Interface

- **Responsive Design:** Mobile-first responsive layout
- **Dark/Light Themes:** System preference detection and manual toggle
- **Modern Components:** Reusable UI components library
- **Dashboard:** Intuitive file management interface
- **Notifications:** Toast notifications for user feedback
- **Loading States:** Skeleton loading and spinners

### 🔧 Technical Features

- **Type Safety:** Full TypeScript implementation
- **API Documentation:** Auto-generated OpenAPI/Swagger documentation
- **Code Generation:** Automatic API client generation
- **Form Validation:** Zod schema validation with i18n error messages
- **State Management:** React Query for server state management
- **Error Handling:** Comprehensive error handling and logging

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (package manager)
- [Docker](https://www.docker.com/) (for running PostgreSQL database)

### Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/CrissRT/MyCloud.git
   cd MyCloud
   ```

2. **Install dependencies:**

   ```sh
   pnpm install
   ```

3. **Setup environment variables:**

   - Copy `.env.example` to `.env` in the root and `apps/server` directories.
   - Fill in the required environment variables (see `.env.example` for details).

4. **Start the database:**

   ```sh
   pnpm db:up
   ```

5. **Generate Prisma client:**

   ```sh
   pnpm prisma:generate
   ```

6. **Start development servers:**
   ```sh
   pnpm dev
   ```
   This will run both the client and server in development mode.

### Useful Scripts

- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm build` - Build both client and server
- `pnpm start` - Start both client and server in production mode

### Folder Structure

- `apps/client` - Frontend application (Next.js)
- `apps/server` - Backend API (Express.js)
- `packages/shared` - Shared code (types, utilities)

---

For more details, see the documentation in each subfolder.
