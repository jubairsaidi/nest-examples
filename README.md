# Nest.js examples

## Description

A repo to demonstrate nestjs microservice example code

## Requirements

nats.io as a microservice transport.  Note you can modify the docker run command to detatch if you like, however I prefer to run it attacked in it's own session.

```bash
docker run -p 4222:4222 -ti nats:latest
```

## Running the app

```bash
npm run start:dev
```

## Running cli commands

Note: The app must already be running in another terminal session in order for the cli commands to work due to our usage of the `dist/cli.js` file rather than `src/cli.ts`

```bash
npm run cli example plain
npm run cli example http
npm run cli example nats
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
