# RideMate

Student-first carpooling for India: **Share the ride. Share the cost. Travel together.**

This workspace contains a responsive, runnable product demo in the repository root and an API/Prisma foundation in `backend/`.

## Demo credentials and safety

The UI uses local development data only. The API accepts `demo.passenger@example.com` with any password of eight or more characters only for its mock login response. Never use demo credentials or development JWT fallbacks in production.

## Run the web app

```bash
npm install
npm run dev
```

The demo supports ride searching, verified-user filtering, cost-share calculation, publishing a ride, request confirmation, ride status views, profile trust indicators, and safety controls.

## Production integration boundaries

Use an approved KYC provider and retain only verification status/reference/timestamps. Store media in object storage, and use compliant Indian payment providers. The app is deliberately modeled as cost sharing; contributions are transparent suggestions and are not driver fares.
