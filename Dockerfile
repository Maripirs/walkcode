# Walkcode container — tiny Node server that serves the static app and /api/** routes.
# Backend deps are minimal (pg, added in M4); the frontend stays no-build. The deploy
# target never changes as /api/** grows.
FROM node:22-alpine

WORKDIR /app

# Install server deps first (own layer, cached unless the manifest changes).
# node_modules is placed at /app (not /app/server) so the compose dev bind-mount of
# ./server can't shadow it; Node resolves it by walking up from server/server.js.
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

# Copy only what the server needs to serve (context is trimmed by .dockerignore).
# src/** is copied both to be served to the browser and because the server assembles the
# seed content from src/data/** on startup (see server/db.js).
COPY server/server.js ./server/server.js
COPY server/db.js ./server/db.js
COPY server/llm.js ./server/llm.js
COPY index.html ./index.html
COPY src ./src

# Cloud Run provides PORT (defaults to 8080); the server reads it.
ENV PORT=8080
EXPOSE 8080

# Run as the built-in non-root user.
USER node

CMD ["node", "server/server.js"]
