# Booking System Backend

A Node.js/TypeScript backend API for a room booking system using Express, Prisma, PostgreSQL, and Zod.

## Project Structure

```
/src
  /controllers     - HTTP request handlers
  /services        - Business logic layer
  /repositories    - Database access layer
  /entities        - Type definitions (Prisma models)
  /dtos            - Data transfer objects
  /validation      - Zod validation schemas
  /middlewares     - Express middlewares
  /utils           - Utility functions
  /database        - Database configuration
  app.ts           - Express app configuration
  server.ts        - Server entry point
```

## Setup Instructions

### 1. Install Dependencies
Dependencies are already installed:
- **Production**: express, zod, @prisma/client, reflect-metadata, dotenv
- **Development**: typescript, ts-node, @types/node, @types/express, nodemon, prisma

### 2. Configure Database
Update the `.env` file with your PostgreSQL connection details:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/booking_system?schema=public"
PORT=3000
NODE_ENV=development
```

### 3. Initialize Database
Run Prisma migrations to create the database schema:
```bash
npm run prisma:migrate
```

### 4. Generate Prisma Client
Generate the Prisma client:
```bash
npm run prisma:generate
```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled production build
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

## Database Models

### Room
- Room information with number, type, capacity, price
- Amenities and availability tracking
- Relationship to bookings

### Booking
- Guest information and contact details
- Check-in/check-out dates
- Total price and booking status
- Relationship to room

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Development**: Nodemon, ts-node
