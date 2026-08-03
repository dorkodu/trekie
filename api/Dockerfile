FROM oven/bun:1.3-alpine AS base
WORKDIR /usr/src/api

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
RUN bun run build

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=build /usr/src/api/dist dist
COPY --from=build /usr/src/api/package.json .
COPY drizzle.config.ts drizzle/ ./

USER bun
EXPOSE 8000/tcp
ENV NODE_ENV=production
ENTRYPOINT [ "bun", "run", "dist/index.js" ]
