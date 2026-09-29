# Experiment 3 - RBAC End-to-End

## Run in VS Code

```bash
npm install
npm run dev
```

Then open the URL Vite displays, usually:

http://localhost:5173/

## Demo login

Admin:
- username: admin
- password: admin123

Editor:
- username: editor
- password: editor123

Viewer:
- username: viewer
- password: viewer123

## Features

- Login/logout
- Demo JWT token
- Authentication state persistence
- Admin, Editor and Viewer roles
- Protected Admin Panel
- Create User
- Delete User
- Duplicate username validation
- Role-based Edit Content permission
- 403 unauthorized page
- localStorage persistence

This is a frontend academic demo. Real production JWT authentication must use a backend, secure transport, secure cookie/session strategy and server-side authorization.
