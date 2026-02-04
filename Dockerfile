FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npm prune --production


FROM node:22-alpine AS production
WORKDIR /app

RUN apk add --no-cache ca-certificates curl

RUN addgroup -S app && adduser -S app -G app

ENV NODE_ENV=production


COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/package*.json ./
COPY --from=builder --chown=app:app /app/prisma ./prisma

RUN mkdir -p /app/logs && chown -R app:app /app

USER app

EXPOSE 8080

CMD ["npm", "run", "start:prod"]