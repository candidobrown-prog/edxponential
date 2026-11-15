# One container: builds the React app, then the Node backend serves it plus the API.
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./backend/
RUN npm --prefix backend ci --omit=dev
COPY backend ./backend
COPY --from=build /app/dist ./dist
ENV NODE_ENV=production DATA_DIR=/data PORT=8787
VOLUME /data
EXPOSE 8787
CMD ["node", "backend/src/server.js"]
