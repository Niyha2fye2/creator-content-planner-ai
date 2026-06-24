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
## Tech Stack
- Next.js
- Supabase
- OpenAI
- Vercel
