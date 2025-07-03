# Multi-stage build pour optimiser la taille de l'image
# Utiliser une version spécifique pour éviter les vulnérabilités de versions récentes
FROM node:20.18.1-alpine3.20 AS base

# Installer les dépendances uniquement quand nécessaire
FROM base AS deps
# Mise à jour des packages de sécurité et installation des dépendances nécessaires
RUN apk update && apk upgrade && \
    apk add --no-cache libc6-compat dumb-init && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml* ./
RUN chmod 644 package.json pnpm-lock.yaml* || true

# Installer les dépendances avec optimisations de sécurité
RUN npm install -g pnpm@9.1.4 && \
    pnpm config set store-dir /app/.pnpm-store && \
    pnpm i --frozen-lockfile --prefer-offline && \
    rm -rf /app/.pnpm-store

# Rebuild le code source uniquement quand nécessaire
FROM base AS builder
WORKDIR /app

# Copier les node_modules avec les bonnes permissions
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

# Définir l'utilisateur non-root pour le build
USER node

# Next.js collecte des données de télémétrie totalement anonymes sur l'usage général.
# Désactiver la télémétrie pour des raisons de sécurité et de performance
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Construire l'application avec optimisations de sécurité
RUN npm install -g pnpm@9.1.4 && \
    pnpm run build && \
    rm -rf node_modules/.cache

# Image de production, copier tous les fichiers et exécuter next
FROM base AS runner
WORKDIR /app

# Variables d'environnement sécurisées
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Mise à jour des packages de sécurité et installation de dumb-init
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Créer le groupe et l'utilisateur avec des IDs spécifiques (sécurité)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs

# Créer les répertoires avec les bonnes permissions avant de copier
RUN mkdir -p /app/.next /app/public && \
    chown -R nextjs:nodejs /app

# Passer à l'utilisateur non-root pour les opérations de copie
USER nextjs

# Copier les fichiers publics avec les bonnes permissions
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Tirer parti des Outputs Traces pour réduire la taille de l'image
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Health check pour s'assurer que l'application fonctionne
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node --version || exit 1

EXPOSE 3000

# Utiliser dumb-init pour gérer les signaux proprement (sécurité PID 1)
ENTRYPOINT ["dumb-init", "--"]

# serveur.js est créé par next build à partir de la sortie standalone
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
