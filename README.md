# SupportAI

AI-powered customer support platform with knowledge-base RAG, conversation history, and support ticket management.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, JWT
- **Database:** PostgreSQL / Supabase
- **AI:** LLM API with RAG

## Project Structure

```
SupportAI/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── middleware/
│   └── config/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
└── database/
    └── schema.sql
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or Supabase)

### Setup

1. Clone the repository and install dependencies:

```bash
npm run install:all
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Create the database and run migrations:

```bash
psql -U postgres -d supportai -f database/schema.sql
```

4. Start development servers:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/chat` | Send a message to AI support |
| GET | `/api/conversations` | List user conversations |
| POST | `/api/tickets` | Create a support ticket |
| GET | `/api/tickets` | List user tickets |

## Deployment

- Frontend → Vercel
- Backend → Render
- Database → Supabase
