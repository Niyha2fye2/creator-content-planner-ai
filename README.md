# CreatorFlow AI

## Features
- AI content generation
- Viral scoring
- Content calendar
- Analytics dashboard
- Role based access control

## Roles

### Viewer
- View content
- View analytics

### Editor
- Create content
- Save content
- Manage own content

### Admin
- Manage users
- Change roles
- View all content


## Testing User Roles

### CreatorFlow includes three user roles:

### Viewer
* Email: viewer.test@creatorflow.com
* Password: Creator123!
### Permissions:

-  View content ideas
-  View calendar posts
-  View analytics
-  Cannot access AI generation
-  Cannot access Admin panel

### Editor
* Email: editor.test@creatorflow.com
* Password: Creator123!

### Permissions:

- All Viewer permissions
- Access AI content generation
- Create and manage content
- Update content status

### Admin
* Email: admin.test@creatorflow.com
* Password: Creator123!
### Permissions:

- Full system access
- Access Admin panel
- Manage user roles
- View all users

Admin accounts can verify that:

- Viewers cannot access the AI page or Admin panel.
- Editors can access AI generation but not the Admin panel.
- Admins have full access to all application features.

## Local Setup
### Clone repository
- git clone https://github.com/Niyha2fye2/creator-content-planner-ai.git
### Install dependencies
- npm install
### Create a .env.local file with:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
### Run development server
 - npm run dev
- Open:
- http://localhost:3000
## Tech Stack
- Next.js
- Supabase
- OpenAI
- Vercel

## Security
Server-side route protection is implemented using Next.js middleware.
API routes verify authenticated sessions before processing requests.
Supabase Row Level Security (RLS) policies restrict users to accessing only their own data.
Admin users can view all profiles and manage roles through additional RLS policies.
## Manual Security Testing

### The following scenarios were tested:

- Unauthenticated users are redirected to the login page when attempting to access protected routes.
- Viewer accounts cannot access the AI page or Admin panel.
- Editor accounts can access AI generation but cannot access the Admin panel.
- Admin accounts can access all application features and manage user roles.
- Users cannot view or modify other users' content, calendar items, or AI history.
