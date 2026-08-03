# Trekie Deployment Plan — Cloudflare + Hetzner + Coolify

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Cloudflare (Free Tier)                   │
│  ┌──────────────────────┐   ┌─────────────────────────────┐ │
│  │   Cloudflare DNS     │   │   Cloudflare Pages (CDN)    │ │
│  │   ──────────────     │   │   ──────────────────────    │ │
│  │   trekie.com  ───────┼──►│   Vite/React SPA           │ │
│  │   api.trek─ie.com ───┼──►│   Auto-deploy from GitHub  │ │
│  └──────────────────────┘   │   env: VITE_API_URL         │ │
│                              └──────────────┬──────────────┘ │
│                                             │                │
│                              ┌──────────────▼──────────────┐ │
│                              │   Cloudflare Proxy (orange  │ │
│                              │   cloud) for API domain     │ │
│                              └──────────────┬──────────────┘ │
└─────────────────────────────────────────────┼───────────────┘
                                              │
┌─────────────────────────────────────────────▼───────────────┐
│              Hetzner VPS — CX32 (€5.39/mo)                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Coolify (Docker)                       │ │
│  │  ┌──────────────┐       ┌──────────────────────────┐    │ │
│  │  │  PostgreSQL  │◄──────│  Trekie API (Bun)        │    │ │
│  │  │  (Coolify-   │       │  Dockerfile → Docker     │    │ │
│  │  │   managed)   │       │  Port 8000               │    │ │
│  │  └──────────────┘       │  Auto-deploy from GitHub │    │ │
│  │                         │  SSL via Caddy/LetsEncrypt│    │ │
│  │                         └──────────────────────────┘    │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │  Coolify Dashboard :8000 (IP-restricted)         │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
│  Ubuntu 24.04, UFW (22, 80, 443, 8000), SSH key auth         │
└─────────────────────────────────────────────────────────────┘
```

## Cost Breakdown

| Service | Plan | Cost | What it runs |
|---------|------|------|-------------|
| Cloudflare Pages | Free | €0/mo | Frontend SPA, CDN, DNS |
| Hetzner VPS | CX32 (2 vCPU, 8GB RAM, 80GB SSD) | €5.39/mo (~$6) | Coolify + PostgreSQL + API |
| **Total** | | **~€5.39/mo** | |

> CX22 (2 vCPU, 4GB, 40GB, €3.79/mo) would work but is deprecated — CX32 is the active replacement at only €1.60 more. The 8GB RAM gives Comfortable headroom for Coolify + PostgreSQL + API.

## Prerequisites

### Accounts
1. **Cloudflare** — [sign up](https://dash.cloudflare.com/sign-up) (free). You need a domain (or buy one through Cloudflare).
2. **Hetzner** — [sign up](https://www.hetzner.com/cloud) (email + payment). EU datacenters available.
3. **GitHub** — already have it. The repo needs to be on GitHub (not local-only).

### Local Tools
```bash
# Cloudflare CLI (for initial Pages setup)
npm install -g wrangler

# SSH key (likely already exists)
ls ~/.ssh/id_ed25519.pub  # if not: ssh-keygen -t ed25519
```

## Phase 1 — VPS Setup (Hetzner)

### 1. Create Server
1. Log into [Hetzner Cloud Console](https://console.hetzner.cloud)
2. Create Project → Add Server
3. Select: **CX32** (2 vCPU, 8GB RAM, 80GB SSD)
4. Image: **Ubuntu 24.04**
5. Location: **Nuremberg** (nearest EU DC, lowest latency for Turkey) or Helsinki
6. Add your SSH public key
7. Create — note the IPv4 address
8. Optional: enable Firewall in Hetzner UI (allow SSH only from your IP initially)

### 2. Initial Server Hardening
```bash
ssh root@<your-server-ip>

# Update system
apt update && apt upgrade -y

# Create deploy user
adduser deploy
usermod -aG sudo deploy

# Copy SSH key
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Harden SSH
sed -i 's/^PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/^#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd

# UFW firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8000/tcp    # Coolify dashboard (restrict to your IP later)
ufw enable

# Exit SSH, reconnect as deploy
exit
ssh deploy@<your-server-ip>
```

### 3. Install Coolify
```bash
# One-command install
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# This installs Docker + Coolify
# Dashboard will be at http://<your-server-ip>:8000
```

### 4. Configure Coolify
1. Open `http://<your-server-ip>:8000` in browser
2. Create admin account (email + password)
3. Go to **Servers** → your local server should be auto-detected
4. Go to **Settings** → set wildcard domain (e.g., `*.trekie.yourdomain.com`)
5. Generate Let's Encrypt SSL certificates

## Phase 2 — API Deployment (via Coolify)

### 1. Prepare Dockerfile (already exists)
The `api/Dockerfile` is already set up for multi-stage Bun build. It's ready for Coolify — Coolify auto-detects `Dockerfile` and builds it.

### 2. Add API to Coolify
1. In Coolify dashboard: **Applications** → **+ Add**
2. Select **Dockerfile** → **Private Repository** (GitHub)
3. Connect GitHub: authorize Coolify to access the repo
4. Repository: `doruk/trekie` (or wherever it lives)
5. Branch: `main`
6. Build pack: **Dockerfile**
7. Port: `8000`
8. Environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=postgres://trekie:<generated-password>@postgres:5432/trekie
   BETTER_AUTH_SECRET=<generate-a-random-secret>
   BETTER_AUTH_URL=https://api.trekie.yourdomain.com
   ORIGIN=https://trekie.pages.dev
   ```
9. Deploy

### 3. Add PostgreSQL Database
1. In Coolify: **Databases** → **+ Add** → **PostgreSQL**
2. Name: `trekie-db`
3. Username: `trekie`
4. Password: auto-generate (save it)
5. Database: `trekie`
6. Deploy

### 4. Link API to Database
1. In the API service settings, go to **Environment Variables**
2. Add `DATABASE_URL=postgres://trekie:<password>@trekie-db:5432/trekie`
3. Coolify automatically links services by container name — the API container can reach `trekie-db` via internal Docker network
4. Re-deploy the API service

### 5. Domain & SSL
1. In API service settings → **Domains**
2. Add: `api.trekie.yourdomain.com`
3. Coolify automatically provisions Let's Encrypt SSL via Caddy/Traefik
4. Wait for SSL certificate generation

### 6. Auto-Deployment
1. In API service settings → **Webhooks**
2. Copy the deploy webhook URL
3. In GitHub repo → Settings → Webhooks → Add webhook
4. Paste URL, content type: `application/json`
5. Now every push to `main` auto-deploys the API

## Phase 3 — Frontend Deployment (Cloudflare Pages)

### 1. Build Check
```bash
# Verify the web app builds cleanly
bun --cwd web build
# Output goes to web/dist/
```

### 2. Deploy via Wrangler CLI (one-time)
```bash
# Authenticate
wrangler login

# Deploy to Cloudflare Pages
wrangler pages deploy web/dist --project-name=trekie

# Or use the dashboard:
# Cloudflare Dashboard → Pages → Create → Connect to Git
```

### 3. Deploy via Git (recommended — auto-deploy)
1. Go to **Cloudflare Dashboard** → **Pages** → **Create a project**
2. **Connect to Git** → authorize GitHub
3. Select `doruk/trekie`
4. Build settings:
   - Build command: `bun run build`
   - Build output directory: `dist`
   - Root directory (advanced): `web`
5. Environment variables:
   - `VITE_API_URL` = `https://api.trekie.yourdomain.com`
6. Deploy

### 4. SPA Fallback (Client-Side Routing)
Cloudflare Pages supports SPA fallback. Add a `_redirects` file (or configure in the dashboard):
```bash
# web/public/_redirects
/* /index.html 200
```
This returns `index.html` for all routes, letting TanStack Router handle routing client-side.

### 5. Cache Headers for Static Assets
Create `web/public/_headers` for optimal CDN caching:
```bash
# web/public/_headers
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/sw.js
  Cache-Control: public, max-age=0, must-revalidate
```

### 6. Custom Domain
1. In Cloudflare Pages → trekie → **Custom domains**
2. Add: `trekie.yourdomain.com`
3. Cloudflare automatically manages DNS + SSL

### 7. Auto-Deployment
- Enabled by default when connected to Git
- Every push to main triggers a build + deploy (~1-2 min)

## Phase 4 — DNS & Networking

### DNS Setup (Cloudflare)

| Record | Type | Value | Proxy |
|--------|------|-------|-------|
| `trekie.yourdomain.com` | CNAME | `trekie.pages.dev` | Proxied (orange cloud) |
| `api.trekie.yourdomain.com` | A | `<hetzner-server-ip>` | Proxied (orange cloud) |

Cloudflare proxying (orange cloud) for the API provides:
- DDoS protection
- SSL termination
- Caching for static responses
- IP obfuscation (hides your Hetzner IP)
- The actual connection Cloudflare→Hetzner uses your real server IP on port 443

### Firewall: Allow Only Cloudflare IPs (optional hardening)
```bash
# On Hetzner — restrict HTTP/S to Cloudflare origin IPs only
ufw default deny incoming

# Allow Cloudflare IP ranges
for ip in $(curl -s https://www.cloudflare.com/ips-v4); do
  ufw allow from $ip to any port 80 proto tcp
  ufw allow from $ip to any port 443 proto tcp
done
for ip in $(curl -s https://www.cloudflare.com/ips-v6); do
  ufw allow from $ip to any port 80 proto tcp
  ufw allow from $ip to any port 443 proto tcp
done

ufw allow 22/tcp        # SSH (or restrict to your home IP)
ufw allow 8000/tcp      # Coolify dashboard (restrict to your IP)
ufw reload
```

## Phase 5 — Verification Checklist

```bash
# 1. API health check
curl https://api.trekie.yourdomain.com/
# → {"status":"ok"} or similar

# 2. Database connection
# Check Coolify dashboard → trekie-db → logs
# Or from API logs in Coolify

# 3. Frontend loads
curl https://trekie.yourdomain.com/
# → Returns index.html

# 4. Frontend → API works
# Open browser, check network tab
# Make sure VITE_API_URL is set to the production API URL

# 5. SSL valid
curl -I https://api.trekie.yourdomain.com/
# → 200, TLS valid

# 6. Auto-deploy works
git push origin main
# → Cloudflare Pages builds automatically
# → Coolify webhook triggers API rebuild
```

## Database Backups

Configured in Coolify:
- Schedule: daily (`0 0 * * *`)
- Retention: 7 days
- Optional: S3-compatible backup for off-site storage (Backblaze B2, etc.)

Also add a manual pre-deploy backup step in the API's build process:
```bash
# Coolify pre-deployment command (optional)
pg_dump $DATABASE_URL > /tmp/pre-deploy-backup.sql
```

## Rollback Strategy

| Component | Method | Time |
|-----------|--------|------|
| Frontend | Cloudflare Pages → Deployments → Rollback to previous | 1 click, instant |
| API | Coolify → Deployments → Rollback | 1 click, ~30s |
| Database | `pg_restore` from Coolify backup | ~5 min |

## Migration from Current Docker Compose

The local `docker compose up -d` setup won't change — it stays as the dev environment. The production setup (Coolify on Hetzner) is completely separate.

Before deploying production:
1. Run `bun db:generate` to create any missing migrations
2. Run `bun db:migrate` locally to verify schema is up to date
3. The migrations are part of the repo — when Coolify builds the API, it can run `db:migrate` as part of the Docker entrypoint or a one-time init

## Files to Create

The following files need to be added to the repo for this deployment:

| File | Purpose | Status |
|------|---------|--------|
| `web/public/_redirects` | SPA fallback (/* → /index.html) | ✅ Plan |
| `web/public/_headers` | CDN cache headers for assets | ✅ Plan |
| `api/Dockerfile` | Already exists, needs verification | ✅ Existing |

## Quick Start Summary

```bash
# 1. Hetzner — create CX32 Ubuntu 24.04, add SSH key
# 2. Hetzner — install Coolify: curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
# 3. Coolify UI — add PostgreSQL database
# 4. Coolify UI — add API service from GitHub (Dockerfile, port 8000)
# 5. Coolify UI — set env vars + domain api.trekie.yourdomain.com
# 6. Cloudflare Pages — connect GitHub repo (build: bun run build, dir: dist, root: web)
# 7. Cloudflare Pages — set domain trekie.yourdomain.com
# 8. Cloudflare DNS — proxy API subdomain to Hetzner IP
# 9. Set _redirects + _headers for SPA routing + CDN caching
```
