# Hono with Node.js API

A robust API project structure using Hono framework with Node.js runtime.

## Features

- **Hono Framework**: Fast, lightweight, and type-safe web framework for Node.js
- **TypeScript**: Full type safety and modern JavaScript features
- **Prisma ORM**: Type-safe database client for MongoDB
- **MongoDB**: NoSQL database integration
- **Middleware**: Logger, Security Headers, Error Handling
- **Routing**: Structured API routes
- **CORS Configuration**: Cross-Origin Resource Sharing support
- **Environment Variables**: Configuration via environment variables
- **Developer Experience**: Watch mode with Nodemon for fast development
- **Security**: Implementation of security best practices

## Folder Structure

```
hono-nodejs-app/
├── prisma/
│   └── schema.prisma     # Prisma schema definition
├── scripts/
│   └── setup-db.ts       # Database setup script
├── src/
│   ├── routes/           # Route definitions
│   ├── middleware/       # Middleware functions
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic and data access
│   ├── prisma/           # Prisma client and database utilities
│   ├── utils/            # Utility functions
│   ├── config/           # Application configuration
│   ├── app.ts            # Application setup
│   └── index.ts          # Entry point
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore file
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (version 16.x or later)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/hono-nodejs-app.git
   cd hono-nodejs-app
   ```

2. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Update the MongoDB connection string in the `.env` file:
   ```
   DATABASE_URL="mongodb://username:password@localhost:27017/hono_app?authSource=admin"
   ```

5. Generate the Prisma client:
   ```bash
   npm run prisma:generate
   # or
   yarn prisma:generate
   ```

6. Push the database schema to MongoDB:
   ```bash
   npm run prisma:push
   # or
   yarn prisma:push
   ```

7. (Optional) Set up initial data:
   ```bash
   npm run db:setup
   # or
   yarn db:setup
   ```

8. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The server will start at http://localhost:3000.

## Development

- **Start in development mode** (with hot reloading):
  ```bash
  npm run dev
  # or
  yarn dev
  ```

- **Build for production**:
  ```bash
  npm run build
  # or
  yarn build
  ```

- **Start in production mode**:
  ```bash
  npm start
  # or
  yarn start
  ```

## Database Management

- **Open Prisma Studio** (database GUI):
  ```bash
  npm run prisma:studio
  # or
  yarn prisma:studio
  ```

- **Update Prisma Client** (after schema changes):
  ```bash
  npm run prisma:generate
  # or
  yarn prisma:generate
  ```

- **Push Schema Changes** (to MongoDB):
  ```bash
  npm run prisma:push
  # or
  yarn prisma:push
  ```

- **Reset Database** (caution: deletes all data):
  ```bash
  npm run db:reset
  # or
  yarn db:reset
  ```

## API Endpoints

- `GET /`: Welcome message
- `GET /health`: Health check
- `GET /api`: API information
- `GET /api/status`: API status
- `GET /users`: Get all users
- `GET /users/:id`: Get user by ID
- `POST /users`: Create a new user
- `PUT /users/:id`: Update a user
- `DELETE /users/:id`: Delete a user

## License

This project is licensed under the MIT License.