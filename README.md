# Portfolio Deployment Engine

## Overview
Cloudflare Worker + backend service yang menyediakan endpoint distribusi installer `vsp-porto` dan memetakan pipeline deployment prototype VSP. Repositori ini hanya menyimpan data plane (worker script + config). Arsitektur lengkap tersedia di [pes-docs](https://github.com/vspatabuga/pes-docs).

## Stack
- **Runtime**: Cloudflare Workers (JavaScript/TypeScript via Wrangler).
- **Build**: `npm run build` menghasilkan bundle worker, `wrangler publish` untuk deploy.

## Getting Started
```bash
git clone git@github.com:vspatabuga/portfolio-deployment-engine.git
cd portfolio-deployment-engine
npm install
npm run dev

# deploy to Cloudflare (requires secrets)
npm run deploy
```

## API
- `GET /install`: unduh installer shell script.
- `GET /`: landing page dan status worker.

## Security & Maintenance
- Secrets (`CF_API_TOKEN`, `ACCOUNT_ID`, dsb.) dijaga di Vault dan tidak di-commit.
- Dependabot memantau `package-lock.json` mingguan.
- Laporkan kerentanan melalui GitHub Issue berlabel `security` atau email `sc@vspatabuga.io`.

## License
Apache License 2.0 © 2026 Virgiawan Sagarmata Patabuga.
