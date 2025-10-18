# Soleira Lounge

## Summary
Full-stack social platform with authenticated profiles, messaging, posts, comments, likes, and notifications. Built to demonstrate production patterns in a TypeScript/Node ecosystem.

## Tech
- **Frontend:** React, Vite, Tailwind CSS  
- **Backend:** Node.js, Express  
- **Database:** PostgreSQL, Prisma ORM  
- **Auth:** JWT (access/refresh)  
- **Quality:** Vitest, TDD  
- **DevOps:** Git, CI/CD

## Highlights
- Real user model with profiles, follow graph, and privacy controls  
- Direct and group messaging with delivery states  
- Feed with optimistic UI and pagination  
- Notifications for likes, comments, mentions  
- Secure auth and access control

## Architecture
- REST API with controllers and Zod validation  
- Normalized Postgres schema for users, messages, posts, reactions  
- Background jobs for cleanup and analytics  
- Structured logging and error handling

## Testing
- Unit and integration tests for API flows  
- Ephemeral test DB seeded per run  

## Check it out here: https://asseternity.github.io/messenger-frontend/
