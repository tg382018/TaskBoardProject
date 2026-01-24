FROM node:18-alpine

WORKDIR /app

# pnpm
RUN corepack enable

# workspace dosyaları
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# workspace paket manifestleri
COPY apps/api/package.json apps/api/package.json
COPY packages/common/package.json packages/common/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY apps/worker/package.json apps/worker/package.json
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --frozen-lockfile

# packages/common'ı da kopyala (events.js için gerekli)
COPY packages/common packages/common
COPY apps/api apps/api

WORKDIR /app/apps/api
EXPOSE 3001

CMD ["pnpm", "dev"]