# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist

# Persistent volume for the reviews database
VOLUME ["/app/data"]
ENV REVIEWS_FILE=/app/data/reviews.json

EXPOSE 3000
CMD ["node", "dist/server.cjs"]
