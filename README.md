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

### Permissions:

-  View content ideas
-  View calendar posts
-  View analytics
-  Cannot access AI generation
-  Cannot access Admin panel

### Editor

### Permissions:

- All Viewer permissions
- Access AI content generation
- Create and manage content
- Update content status

### Admin

### Permissions:

- Full system access
- Access Admin panel
- Manage user roles
- View all users

### How to Test Roles

1. Create a new account using the Sign Up page.
2. Log in using an Admin account.
3. Navigate to the Admin Panel.
4. Locate the user you would like to modify.
5. Change the user’s role using the role dropdown (viewer, editor, or admin).
6. Log out and log back in using that account to test the selected permissions.

Admin accounts can verify that:

- Viewers cannot access the AI page or Admin panel.
- Editors can access AI generation but not the Admin panel.
- Admins have full access to all application features.
## Tech Stack
- Next.js
- Supabase
- OpenAI
- Vercel
