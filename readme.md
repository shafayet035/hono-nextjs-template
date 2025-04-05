# SF Full Stack Template

A Hono-based Node.js API with PostgreSQL database for SF-Form application and Next.js as a Frontend

## Prerequisites

-   Node.js 18+
-   pnpm
-   Docker and Docker Compose (for PostgreSQL)

## Getting Started with Backend

### Clone the Repository

```bash
cd server
```

### Install Dependencies

```bash
pnpm install
```

### Set Up Environment Variables

```bash
cp .env.example .env
```

Update the environment variables in `.env` as needed, especially the database connection URL if you've changed the default PostgreSQL credentials.

### Start PostgreSQL Database

```bash
docker-compose up -d
```

This will start a PostgreSQL container with the credentials specified in the `docker-compose.yml` file.

### Database Setup

Generate Prisma client:

```bash
pnpm db:generate
```

Run migrations:

```bash
pnpm db:migrate
```

### Start Development Server

```bash
pnpm dev
```

The server will start at `http://localhost:3000` by default (or the port specified in your `.env` file).

## Database Commands

-   Generate Prisma client: `pnpm db:generate`
-   Push schema changes to database: `pnpm db:push`
-   Run migrations: `pnpm db:migrate`
-   Launch Prisma Studio: `pnpm db:studio`
-   Setup initial data: `pnpm db:setup`
-   Reset database: `pnpm db:reset`

## API Endpoints

-   `GET /` - Welcome message
-   `GET /health` - Health check
-   `GET /v1/api` - API information
-   `GET /v1/api/status` - API status

assword: adminPassword123

## Project Structure

-   `src/` - Source code
    -   `app.ts` - Main application setup
    -   `index.ts` - Server entry point
    -   `config/` - Configuration files
    -   `controllers/` - Request handlers
    -   `middleware/` - Custom middleware
    -   `routes/` - API routes
    -   `utils/` - Utility functions
-   `prisma/` - Prisma ORM files
    -   `schema.prisma` - Database schema
    -   `client.ts` - Prisma client export
    -   `init.ts` - Database connection utilities
-   `scripts/` - Helper scripts
    -   `db.ts` - Database setup script

## Frontend Setup

### Clone the Repository

```bash
cd client
```

### Install Dependencies

```bash
pnpm install
```

### Start Development Server

```bash
pnpm dev
```

The server will start at `http://localhost:3001` by default (or the port specified in your `.env` file).
