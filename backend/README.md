# WNDMNGR Backend API

Backend REST API pour WNDMNGR, construit avec Cloudflare Workers et le framework Hono.

## Prerequisites

- Node.js 20+ (recommandé) ou 22+
- npm
- Compte Cloudflare (pour le déploiement)

## Installation

```bash
cd backend
npm install --ignore-scripts
```

> **Note Windows**: Sur certains environnements Windows avec restrictions de sécurité, utilisez `--ignore-scripts` pour contourner les blocages de binaires.

## Développement local

```bash
# Option 1: Wrangler (utilise workerd - peut être bloqué sur Windows)
npm run dev

# Option 2: Node.js (recommandé sur Windows avec restrictions)
npm run dev:node
```

Le serveur sera accessible sur `http://localhost:8787`

## Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur Wrangler (workerd) |
| `npm run dev:node` | Serveur Node.js (contourne restrictions Windows) |
| `npm run build:node` | Compile TypeScript pour Node.js |
| `npm run deploy` | Déploie sur Cloudflare Workers |
| `npm run typecheck` | Vérifie les types TypeScript |

## Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Hello World - Info API |
| GET | `/health` | Health check |

## Structure du projet

```
backend/
├── src/
│   └── index.ts        # Point d'entrée Hono
├── wrangler.toml       # Configuration Cloudflare Worker
├── package.json        # Dépendances et scripts
├── tsconfig.json       # Configuration TypeScript
└── README.md           # Ce fichier
```

## Stack technique

- **Runtime**: Cloudflare Workers (Edge)
- **Framework**: [Hono](https://hono.dev/) - Ultrafast web framework
- **Language**: TypeScript
- **Bundler**: esbuild (via wrangler)

## Troubleshooting

### Windows Group Policy bloque workerd/esbuild

Si vous voyez "Ce programme est bloqué par une stratégie de groupe":

```bash
# Solution recommandée: utiliser le serveur Node.js
npm run dev:node
```

Le serveur Node.js utilise `@hono/node-server` et fonctionne sans binaires bloqués.

### npm install échoue avec esbuild

Utilisez:

```bash
npm install --ignore-scripts
```
