# CreatorFlow AI

CreatorFlow AI is an AI-powered content planning platform designed to help creators brainstorm, organize, and manage social media content. Users can generate AI-powered content ideas, schedule posts, track performance, and collaborate through a secure role-based system.

---

## Features

* AI-powered content generation using OpenAI
* Viral score prediction system
* Content calendar and scheduling
* Analytics dashboard
* Content history tracking
* Role-based access control
* Admin dashboard for user management
* Secure authentication with Supabase

---

## Tech Stack

* Next.js
* TypeScript
* Supabase
* OpenAI API
* Tailwind CSS
* Vercel

---

## User Roles

### Viewer

Viewers can:

* View content ideas
* View analytics
* View scheduled content
* View their profile and AI history

Viewers cannot:

* Access the AI Generator
* Access the Admin panel
* Manage users

### Editor

Editors can:

* Access all Viewer features
* Generate AI content
* Create and manage their own content
* Create scheduled posts
* Update content status

Editors cannot:

* Access the Admin panel
* Manage users or roles

### Admin

Admins have full access to the application and can:

* Access the Admin dashboard
* Manage users and roles
* View all users and content
* Create, edit, and delete all content
Cannot:
* View users passwords
* Access authentication credentials 

---

# Testing the Application

The following test accounts are available for evaluating role-based access control.

## Viewer Account

Email: `viewer.test@creatorflow.com`

Password: `Creator123!`

Expected behavior:

* Can view content and analytics
* Cannot access AI generation
* Cannot access the Admin panel

---

## Editor Account

Email: `editor.test@creatorflow.com`

Password: `Creator123!`

Expected behavior:

* Can access AI generation
* Can create and manage content
* Cannot access the Admin panel

---

## Admin Account

Email: `admin.test@creatorflow.com`

Password: `Creator123!`

Expected behavior:

* Full access to all features
* Can access the Admin dashboard
* Can manage user roles

---

# Local Setup Instructions

## 1. Clone the repository

```bash
git clone https://github.com/Niyha2fye2/creator-content-planner-ai.git
```

## 2. Navigate into the project folder

```bash
cd creator-content-planner-ai
```

## 3. Install dependencies

```bash
npm install
```

## 4. Create a `.env.local` file

Add the following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

Replace these values with your own Supabase and OpenAI credentials.

## 5. Start the development server

```bash
npm run dev
```

## 6. Open the application

Visit:

```text
http://localhost:3000
```

---

# Security Features

CreatorFlow uses several security mechanisms:

* Server-side route protection using Next.js middleware
* Server-side session verification for API routes
* Supabase Row Level Security (RLS)
* Role-based access control
* Protected admin functionality
* Secure authentication through Supabase Auth

---

# Manual Security Testing

The following security scenarios were manually tested:

* Unauthenticated users are redirected to the login page when attempting to access protected pages.
* Viewer accounts cannot access the AI Generator or Admin dashboard.
* Editor accounts can access AI generation but cannot access the Admin dashboard.
* Admin accounts have full system access.
* Users cannot view or modify another user's content, calendar items, or AI history.

---

# Important Notes

Sensitive files are excluded from the repository and should never be committed:

```text
.env
.env.local
AGENTS.md
CLAUDE.md
```

API keys and credentials are stored locally and are not included in this repository.
