# Job Application Form

A full-stack multi-step job application form built with TypeScript.

## Tech Stack

- **Frontend**: TypeScript + Vite + Plain HTML/CSS
- **Backend**: Node.js + Express + TypeScript
- **Testing**: Vitest (both frontend and backend)
- **Storage**: In-memory (no database)

## Project Structure

```
job-application-form/
├── backend/
│   ├── src/
│   │   ├── server.ts      # Express server with routes
│   │   ├── validation.ts  # Pure validation functions
│   │   └── store.ts       # In-memory storage
│   └── test/
│       └── validation.test.ts
├── frontend/
│   ├── src/
│   │   ├── main.ts        # Form logic and DOM handling
│   │   ├── validation.ts  # Client-side validation
│   │   ├── api.ts         # API client
│   │   └── styles.css     # Styles
│   ├── test/
│   │   ├── validation.test.ts
│   │   └── form.test.ts
│   └── index.html
├── shared/
│   └── src/
│       └── types.ts       # Shared TypeScript types
├── package.json           # Root workspace config
└── README.md
```

## Setup

### Install Dependencies

```bash
npm install
```

### Development

Run both frontend and backend concurrently:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

Or run them separately:

```bash
npm run dev:backend   # Backend only
npm run dev:frontend  # Frontend only
```

### Testing

Run all tests:

```bash
npm test
```

Or run tests separately:

```bash
npm run test:backend   # Backend tests only
npm run test:frontend  # Frontend tests only
```

### Build

```bash
npm run build
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/applications/validate` | Validate application data |
| POST | `/api/applications` | Submit application |
| GET | `/api/applications/:id` | Get application by ID |

## Form Steps

1. **Personal Info**: First name, last name, email, phone
2. **Work Eligibility**: Work authorization status with conditional sponsorship fields
3. **Experience**: Years of experience, optional portfolio/resume URLs
4. **Preview**: Review all information before submission

## Validation Rules

### Personal Info
- First name: Required, minimum 2 characters
- Last name: Required, minimum 2 characters
- Email: Required, valid email format
- Phone: Required, valid phone format

### Work Eligibility
- Work authorization: Required (yes/no)
- If "no": Sponsorship needed required, explanation required (min 20 chars)

### Experience
- Years of experience: Required, non-negative integer
- Portfolio URL: Optional, must be valid URL if provided
- Resume URL: Optional, must be valid URL if provided

## Features

- Multi-step form with progress indicator
- Real-time field validation on blur
- Step validation before proceeding
- Conditional fields based on work authorization
- Preview screen before submission
- Success state with application ID
- Responsive design
- XSS protection in preview rendering
