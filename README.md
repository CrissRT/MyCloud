# My Cloud

A project for personal/enterprise cloud storage.

## Project Summary

This project is a full-stack personal cloud storage solution. It allows users to securely store, manage, and access their files online. The system is built with a modern web stack, including:

- **Frontend:** Next.js (React)
- **Backend:** Express.js with Prisma ORM and PostgreSQL
- **Shared:** Common utilities and types shared between client and server
- **Dev Tools:** TypeScript, ESLint, Prettier, Husky, Commitlint, and more

## Features

- User authentication and secure login
- File upload, download, and management
- Storage quota enforcement
- Account lockout and security measures
- Internationalization support

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
