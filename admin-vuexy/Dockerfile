FROM node:18-alpine AS base
# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

ARG PORT
ARG NEXT_PUBLIC_JWT_EXPIRATION
ARG NEXT_PUBLIC_JWT_SECRET
ARG NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET
ARG ADMIN_GATEWAY_URL
ARG NEXT_PUBLIC_API_URL_DEV
ARG GRAPHQL_URL
ARG GRAPHQL_TOKEN
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

ENV PORT=$PORT
ENV NEXT_PUBLIC_JWT_EXPIRATION=$NEXT_PUBLIC_JWT_EXPIRATION
ENV NEXT_PUBLIC_JWT_SECRET=$NEXT_PUBLIC_JWT_SECRET
ENV NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET=$NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET
ENV ADMIN_GATEWAY_URL=$ADMIN_GATEWAY_URL
ENV NEXT_PUBLIC_API_URL_DEV=$NEXT_PUBLIC_API_URL_DEV
ENV GRAPHQL_URL=$GRAPHQL_URL
ENV GRAPHQL_TOKEN=$GRAPHQL_TOKEN
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

RUN echo "The value of NEXT_PUBLIC_JWT_EXPIRATION is: ${NEXT_PUBLIC_JWT_EXPIRATION}"
RUN echo "The value of NEXT_PUBLIC_JWT_SECRET is: ${NEXT_PUBLIC_JWT_SECRET}"
RUN echo "The value of NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET is: ${NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET}"
RUN echo "The value of ADMIN_GATEWAY_URL is: ${ADMIN_GATEWAY_URL}"
RUN echo "The value of GRAPHQL_URL is: ${GRAPHQL_URL}"
RUN echo "The value of GRAPHQL_TOKEN is: ${GRAPHQL_TOKEN}"
RUN echo "The value of NEXT_PUBLIC_API_URL_DEV is: ${NEXT_PUBLIC_API_URL_DEV}"


RUN apk add --no-cache libc6-compat
WORKDIR /app

#COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
#RUN npm i


# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm i --legacy-peer-deps


# Rebuild the source code only when needed
FROM base AS builder
ARG PORT
ARG NEXT_PUBLIC_JWT_EXPIRATION
ARG NEXT_PUBLIC_JWT_SECRET
ARG NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET
ARG ADMIN_GATEWAY_URL
ARG NEXT_PUBLIC_API_URL_DEV
ARG GRAPHQL_URL
ARG GRAPHQL_TOKEN
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV production
ENV PORT=$PORT
ENV NEXT_PUBLIC_JWT_EXPIRATION=$NEXT_PUBLIC_JWT_EXPIRATION
ENV NEXT_PUBLIC_JWT_SECRET=$NEXT_PUBLIC_JWT_SECRET
ENV NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET=$NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET
ENV ADMIN_GATEWAY_URL=$ADMIN_GATEWAY_URL
ENV NEXT_PUBLIC_API_URL_DEV=$NEXT_PUBLIC_API_URL_DEV
ENV GRAPHQL_URL=$GRAPHQL_URL
ENV GRAPHQL_TOKEN=$GRAPHQL_TOKEN
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

RUN echo "The value of NEXT_PUBLIC_JWT_EXPIRATION1 is: ${NEXT_PUBLIC_JWT_EXPIRATION}"
RUN echo "The value of NEXT_PUBLIC_JWT_SECRET is1: ${NEXT_PUBLIC_JWT_SECRET}"
RUN echo "The value of NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET is1: ${NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET}"
RUN echo "The value of ADMIN_GATEWAY_URL is1: ${ADMIN_GATEWAY_URL}"
RUN echo "The value of GRAPHQL_URL is1: ${GRAPHQL_URL}"
RUN echo "The value of GRAPHQL_TOKEN is1: ${GRAPHQL_TOKEN}"
RUN echo "The value of NEXT_PUBLIC_API_URL_DEV is1: ${NEXT_PUBLIC_API_URL_DEV}"
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
ARG NEXTAUTH_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
WORKDIR /app
ENV NODE_ENV production
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]



