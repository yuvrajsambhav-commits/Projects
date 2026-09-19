# RideMate API

Express + TypeScript API foundation for the RideMate cost-sharing platform. It uses JWT middleware, Helmet, CORS, rate limiting, Zod validation and a PostgreSQL Prisma data model.

## Run locally

1. Copy `.env.example` to `.env` and provide a local PostgreSQL connection string and strong JWT secrets.
2. Run `npm install`, then `npx prisma migrate dev` and `npm run dev`.
3. Visit `GET /health` to confirm the service.

The demo response data is development-only. KYC, maps, media storage, FCM and payments must be implemented with approved providers; no Aadhaar, payment credential, or identity-document data is modeled or stored here.
