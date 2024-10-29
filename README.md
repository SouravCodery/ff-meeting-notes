# Fireflies.ai backend test

## Instructions

Run the following commands to get this project running

```
npm i
npm run seed
npm run docker:build
npm run docker:run
```

### API

- `GET /api/meetings`

- `POST /api/meetings`

- `GET /api/meetings/:id`

- `PUT /api/meetings/:id/transcript`

- `POST /api/meetings/:id/summarize`

- `GET /api/tasks`

- `GET /api/meetings/stats` (Aggregation Pipeline working in Atlas, Service has error)

- `GET /api/dashboard` (Ran over time)
