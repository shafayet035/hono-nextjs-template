# SF-Form Project Context

## Overview
SF-Form is a form creation and management system similar to Google Forms with the following core features:
1. Form creation and management
2. Response collection and viewing
3. User authentication with JWT and HTTP cookies

## Technical Stack
- **Backend**: Hono.js (Node.js framework)
- **Database**: MongoDB
- **ORM**: Prisma
- **Authentication**: JWT with HTTP cookies
- **API Structure**: RESTful API

## Current Project Structure
The project already has a solid foundation with:
- Server setup with Hono.js
- MongoDB connection via Prisma
- Basic middleware (error handling, logging, security)
- Initial route structure
- User model in the Prisma schema

## Feature Requirements

### 1. User Authentication
- Registration with name, email, and password
- Login with JWT token returned in HTTP cookies
- Protected routes for authenticated users
- User roles (regular users and admins)

### 2. Form Creation
- Create forms with various field types (text, multiple choice, etc.)
- Edit existing forms
- Share forms via link
- Set form visibility (public/private)
- Form organization (folders, categories)

### 3. Form Response Management
- Collect form responses
- View and analyze responses
- Export responses in different formats
- Response statistics and visualizations

## Database Schema Additions Needed

The current Prisma schema will need additional models:

```prisma
model Form {
  id          String      @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String?
  isPublic    Boolean     @default(false)
  fields      Field[]
  responses   Response[]
  ownerId     String      @db.ObjectId
  owner       User        @relation(fields: [ownerId], references: [id])
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@map("forms")
}

model Field {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  label       String
  type        String   // text, number, multipleChoice, etc.
  required    Boolean  @default(false)
  options     String?  // JSON string for choices in multiple choice
  formId      String   @db.ObjectId
  form        Form     @relation(fields: [formId], references: [id], onDelete: Cascade)
  responses   FieldResponse[]
  order       Int      // To maintain field order
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("fields")
}

model Response {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  formId      String   @db.ObjectId
  form        Form     @relation(fields: [formId], references: [id], onDelete: Cascade)
  responderId String?  @db.ObjectId
  responder   User?    @relation(fields: [responderId], references: [id])
  fieldResponses FieldResponse[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("responses")
}

model FieldResponse {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  value       String   // The response value
  fieldId     String   @db.ObjectId
  field       Field    @relation(fields: [fieldId], references: [id], onDelete: Cascade)
  responseId  String   @db.ObjectId
  response    Response @relation(fields: [responseId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("field_responses")
}
```

## API Endpoints to Implement

### Authentication
- `POST /v1/auth/register` - Register a new user
- `POST /v1/auth/login` - Login and get JWT cookie
- `POST /v1/auth/logout` - Logout and clear cookies
- `GET /v1/auth/me` - Get current user info

### Forms
- `POST /v1/forms` - Create a new form
- `GET /v1/forms` - Get all forms owned by the user
- `GET /v1/forms/:id` - Get a specific form by ID
- `PUT /v1/forms/:id` - Update a form
- `DELETE /v1/forms/:id` - Delete a form
- `POST /v1/forms/:id/fields` - Add fields to a form
- `PUT /v1/forms/:id/fields/:fieldId` - Update a field
- `DELETE /v1/forms/:id/fields/:fieldId` - Delete a field

### Responses
- `POST /v1/forms/:id/responses` - Submit a response to a form
- `GET /v1/forms/:id/responses` - Get all responses for a form
- `GET /v1/forms/:id/responses/:responseId` - Get a specific response
- `DELETE /v1/forms/:id/responses/:responseId` - Delete a response

## Implementation Plan

1. **Authentication System**
   - Implement JWT generation and validation
   - Create authentication middleware for protected routes
   - Implement user registration and login routes

2. **Form Management**
   - Create the form and field models in Prisma
   - Implement CRUD operations for forms
   - Implement field management within forms

3. **Response Collection**
   - Create the response models in Prisma
   - Implement submission endpoints
   - Develop response viewing and analysis features

4. **Frontend Integration**
   - Develop REST API documentation
   - Ensure all endpoints return consistent response formats
   - Implement proper error handling and validation

## Security Considerations
- Use HTTP-only cookies for JWT storage
- Implement CSRF protection
- Validate all form inputs
- Ensure proper access control for forms and responses
- Rate limiting on authentication endpoints

## Performance Considerations
- Index database fields appropriately
- Implement pagination for response listings
- Consider caching for frequently accessed forms