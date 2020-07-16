# chat

## How to run

1. Run `npm run install:all` to install packages;
2. Run `docker-compose up -d` to start docker postgres container;
3. Run `npm run dev` to start api and client.

Also note that you need to add docker.env (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB) and api/.env (POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, PORT, JWT_SECRET, JWT_EXPIRATION_TIME) files. Those values need to match api and client urls in client/src/utils/utils.ts and api/src/main.ts.
