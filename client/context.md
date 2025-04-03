# SF-Form Frontend Project Context

## Overview

The SF-Form frontend is a modern, responsive web application that provides an intuitive interface for form creation, management, and response collection. It serves as the user-facing component of the SF-Form system, connecting to the Hono.js backend API.

## Technical Stack

-   **Framework**: Next.js 14+ (App Router)
-   **State Management**: Zustand
-   **API Communication**: Axios
-   **Styling**: Tailwind CSS with shadcn/ui components
-   **Form Handling**: React Hook Form with Zod validation
-   **Authentication**: JWT with HTTP cookies (managed via Axios)

## Project Structure

The frontend will follow Next.js 14's App Router structure:

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── forms/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/
│   │   │   │   ├── responses/
│   │   │   │   └── share/
│   │   │   ├── create/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── (public)/
│   │   ├── f/[formId]/
│   │   └── layout.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/           (shadcn components)
│   ├── forms/        (form creation components)
│   ├── responses/    (response visualization)
│   ├── auth/         (authentication components)
│   └── shared/       (shared components)
├── lib/
│   ├── api/          (axios client configuration)
│   ├── store/        (zustand stores)
│   ├── utils/        (utility functions)
│   ├── hooks/        (custom hooks)
│   └── validation/   (zod schemas)
├── types/            (TypeScript interfaces/types)
└── public/           (static assets)
```

## Key Features and Implementation

### 1. Authentication System

#### User Interface

-   Clean, modern login/register forms with validation
-   Password strength indicators for registration
-   "Remember me" functionality
-   Password reset workflow
-   Protected routes with authentication guards

#### Zustand Auth Store

```typescript
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async (email, password) => {
        // Implementation
    },
    register: async (userData) => {
        // Implementation
    },
    logout: async () => {
        // Implementation
    },
    fetchUser: async () => {
        // Implementation to retrieve current user data
    },
}));
```

### 2. Form Builder Interface

#### Form Creation Experience

-   Drag-and-drop form builder
-   Live preview of form while building
-   Multiple field types (text, number, multiple choice, checkbox, dropdown, date, etc.)
-   Field validation options
-   Form theming and styling options
-   Form organization with folders/tags

#### Form Management Dashboard

-   List of created forms with search and filtering
-   Form analytics at a glance (responses, views)
-   Quick actions (edit, share, delete, duplicate)
-   Form categorization and organization

#### Zustand Form Store

```typescript
interface FormState {
    forms: Form[];
    currentForm: Form | null;
    isLoading: boolean;
    fetchForms: () => Promise<void>;
    fetchFormById: (id: string) => Promise<void>;
    createForm: (formData: FormData) => Promise<string>;
    updateForm: (id: string, formData: Partial<FormData>) => Promise<void>;
    deleteForm: (id: string) => Promise<void>;
    // Field operations
    addField: (formId: string, field: FieldData) => Promise<void>;
    updateField: (formId: string, fieldId: string, data: Partial<FieldData>) => Promise<void>;
    deleteField: (formId: string, fieldId: string) => Promise<void>;
    reorderFields: (formId: string, newOrder: string[]) => Promise<void>;
}
```

### 3. Form Response UI

#### Response Collection

-   Public form view with clean, accessible design
-   Mobile-responsive layout
-   Progress indicators for multi-page forms
-   Save and continue later functionality
-   Submission confirmation pages

#### Response Analysis

-   Response dashboard with filtering and search
-   Visual data representation (charts, graphs)
-   Response timeline views
-   Export functionality (CSV, PDF, Excel)
-   Individual response detailed view

#### Zustand Response Store

```typescript
interface ResponseState {
    responses: Response[];
    currentResponse: Response | null;
    statistics: ResponseStatistics | null;
    isLoading: boolean;
    fetchResponses: (formId: string) => Promise<void>;
    fetchResponseById: (formId: string, responseId: string) => Promise<void>;
    submitResponse: (formId: string, responseData: ResponseData) => Promise<void>;
    deleteResponse: (formId: string, responseId: string) => Promise<void>;
    fetchStatistics: (formId: string) => Promise<void>;
}
```

### 4. Axios API Integration

#### API Client Configuration

```typescript
import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookie-based auth
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use((config) => {
    // Add any request processing here
    return config;
});

// Response interceptor for handling errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
            // Redirect to login or refresh token
        }
        return Promise.reject(error);
    },
);

export default apiClient;
```

### 5. UI Components with shadcn/ui and Tailwind

#### Core Components

-   Form field components for all supported field types
-   Form builder with drag-and-drop capability
-   Response visualization components (charts, tables)
-   Dashboard widgets and cards
-   Navigation components (sidebar, top navigation)
-   Modal dialogs and notifications

#### Theming

-   Light/dark mode support
-   Customizable primary/accent colors
-   Consistent spacing and typography

### 6. Responsive Design

-   Mobile-first approach with Tailwind
-   Optimized layouts for different device sizes
-   Touch-friendly interactions for mobile users
-   Adaptive form builder interface

### 7. Performance Optimization

-   Server-side rendering for initial page loads
-   Client-side navigation for smooth transitions
-   Image optimization with Next.js Image component
-   Code splitting and lazy loading
-   Optimistic UI updates for immediate feedback

### 8. Error Handling & User Feedback

-   Comprehensive form validation with Zod
-   Clear error messages and validation feedback
-   Loading states and spinners
-   Toast notifications for system messages
-   Offline support and error recovery

## Implementation Plan

### Phase 1: Setup & Authentication

-   Set up Next.js project with TypeScript
-   Configure Tailwind CSS and import shadcn/ui components
-   Create Axios instance and API services
-   Implement authentication flows and protected routes
-   Design and build login/register UI

### Phase 2: Form Builder

-   Develop form builder UI components
-   Implement drag-and-drop functionality
-   Create field type components
-   Build form preview functionality
-   Develop form settings and configuration UI

### Phase 3: Form Management

-   Create forms dashboard with listing and filtering
-   Implement form editing and updating
-   Add form sharing and permissions management
-   Build form organization features (folders, tags)

### Phase 4: Response Collection & Analysis

-   Develop public form submission interface
-   Create response listing and filtering
-   Implement data visualization components
-   Build export functionality
-   Add response analysis tools

### Phase 5: Polish & Optimization

-   Add animations and transitions
-   Implement comprehensive error handling
-   Optimize bundle size and performance
-   Add comprehensive testing
-   Final UI polish and accessibility improvements

## Integration with Backend

The frontend will communicate with the Hono.js backend through RESTful API endpoints:

### Auth Endpoints

-   `POST /v1/auth/register` - User registration
-   `POST /v1/auth/login` - User login
-   `POST /v1/auth/logout` - User logout
-   `GET /v1/auth/me` - Get current user

### Forms Endpoints

-   `GET /v1/forms` - List all forms
-   `POST /v1/forms` - Create new form
-   `GET /v1/forms/:id` - Get form by ID
-   `PUT /v1/forms/:id` - Update form
-   `DELETE /v1/forms/:id` - Delete form
-   `POST /v1/forms/:id/fields` - Add field to form
-   `PUT /v1/forms/:id/fields/:fieldId` - Update field
-   `DELETE /v1/forms/:id/fields/:fieldId` - Delete field

### Responses Endpoints

-   `GET /v1/forms/:id/responses` - Get all responses for a form
-   `POST /v1/forms/:id/responses` - Submit a response
-   `GET /v1/forms/:id/responses/:responseId` - Get specific response
-   `DELETE /v1/forms/:id/responses/:responseId` - Delete response

## Deployment Considerations

-   Vercel for Next.js hosting
-   Environment variable management for different environments
-   CI/CD pipeline for automated deployments
-   Performance monitoring with Vercel Analytics
-   Error tracking with a service like Sentry

## Accessibility Considerations

-   WCAG 2.1 AA compliance
-   Keyboard navigation support
-   Screen reader compatibility
-   Proper contrast ratios and text sizing
-   Accessible form validation and error messaging
