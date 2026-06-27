# Document Manager

A full-stack document management application with AI-powered summarization.

## Tech Stack

**Frontend** — React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query, React Router v8, Axios

**Backend** — Node.js, Express 5, TypeScript, Supabase, tsx

---

## Getting Started

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## Folder Structure

```text
creative-code/
├── client/                         # React frontend
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts            # Axios instance
│   │   ├── assets/
│   │   ├── components/             # Shared components
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   └── ui/
│   │   │       ├── Badge.tsx
│   │   │       ├── Button.tsx
│   │   │       ├── Modal.tsx
│   │   │       └── Spinner.tsx
│   │   ├── features/               # Feature-based modules
│   │   │   ├── ai/
│   │   │   │   ├── api/
│   │   │   │   ├── components/
│   │   │   │   └── types.ts
│   │   │   ├── auth/
│   │   │   │   ├── api/
│   │   │   │   │   └── auth.api.ts
│   │   │   │   ├── components/
│   │   │   │   │   └── AuthTest.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useAuth.ts
│   │   │   │   └── types.ts
│   │   │   └── documents/
│   │   │       ├── api/
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       └── types.ts
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DocumentPage.tsx
│   │   │   ├── Login.tsx
│   │   │   └── NotFound.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── queryClient.ts
│   │   └── vite-env.d.ts
│   ├── package.json
│   └── tsconfig.json
│
└── server/                         # Express backend
    ├── src/
    │   ├── config/
    │   │   ├── ai.ts
    │   │   └── supabase.ts
    │   ├── features/
    │   │   ├── ai/
    │   │   │   ├── ai.controller.ts
    │   │   │   ├── ai.router.ts
    │   │   │   └── ai.service.ts
    │   │   ├── auth/
    │   │   │   ├── auth.controller.ts
    │   │   │   ├── auth.router.ts
    │   │   │   └── auth.service.ts
    │   │   └── documents/
    │   │       ├── documents.controller.ts
    │   │       ├── documents.router.ts
    │   │       └── documents.service.ts
    │   ├── middleware/
    │   │   ├── auth.ts
    │   │   ├── errorHandler.ts
    │   │   └── upload.ts
    │   ├── types/
    │   │   └── response.types.ts
    │   ├── utils/
    │   │   ├── parser.ts
    │   │   └── response.ts
    │   ├── app.ts
    │   └── server.ts
    ├── package.json
    └── tsconfig.json
```
