# chat

[Demo](https://peaceful-river-48954.herokuapp.com)

## How to run

1. Run `npm run install:all` to install packages;
2. Run `docker-compose up -d` to start docker postgres container;
3. Run `npm run dev` to start api and client.

Also note that you need to add docker.env (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB) and api/.env (POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, PORT, JWT_SECRET, JWT_EXPIRATION_TIME) files. Those values need to match api and client urls in client/src/utils/utils.ts and api/src/main.ts.


## Deployment

1. Change host and apiUrl in client/src/utils/api-utils.ts and remove port in api/src/subscriptions/subscriptions.gateway.ts;
2. Run `npm run clent:build` and move contents of client/build to api/src/static;
3. Deploy api.
