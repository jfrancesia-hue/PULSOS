# Pulso · Guía de despliegue

Stack de producción recomendado: **Render (api) + Vercel (web/admin) + Supabase (Postgres) + Cloudflare R2 (storage) + Resend (email) + Twilio (WhatsApp)**.

---

## 1. Base de datos · Supabase

1. Crear proyecto Supabase nuevo (región us-east-1 o sa-east-1).
2. Habilitar extensiones en SQL Editor:
   ```sql
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   CREATE EXTENSION IF NOT EXISTS pg_trgm;
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. En Settings → Database, copiar:
   - `DATABASE_URL` (pooler — para runtime)
   - `DIRECT_URL` (direct — para migrations)
4. Configurar PITR (Point-in-Time Recovery) en plan Pro.

## 2. Storage · Cloudflare R2

1. Crear bucket `pulso-clinical` en Cloudflare R2.
2. Generar API token con permisos read/write.
3. Anotar:
   - `S3_ENDPOINT` (formato `https://<account-id>.r2.cloudflarestorage.com`)
   - `S3_ACCESS_KEY` y `S3_SECRET_KEY`
   - `S3_BUCKET=pulso-clinical`
   - `S3_REGION=auto`

## 3. Email transaccional · Resend (recomendado)

1. Crear cuenta en resend.com.
2. Verificar dominio (`pulso.health` por ejemplo).
3. Anotar:
   - `SMTP_HOST=smtp.resend.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=resend`
   - `SMTP_PASS=re_...` (api key)
   - `SMTP_FROM=Pulso <no-reply@pulso.health>`

## 4. WhatsApp · Twilio

1. Crear cuenta Twilio + activar WhatsApp Sandbox para dev, o pedir número productivo.
2. Anotar:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_FROM=+14155238886` (sandbox) o número aprobado.
3. Para prod, registrar templates de notificación en Meta vía Twilio.

## 5. API · Render

`render.yaml` ya configurado en raíz del repo.

1. New → Blueprint → conectar repo `jfrancesia-hue/PULSOS`.
2. Render lee `render.yaml` y crea:
   - `pulso-api` (web service)
   - `pulso-audit-verify` (cron diario para verificar hash chain)
3. Completar las env vars marcadas como `sync: false` (DATABASE_URL, S3, SMTP, Twilio, etc.).
4. Primera ejecución corre `pnpm db:migrate:deploy` automáticamente. **IMPORTANTE**: aplicar manualmente los triggers SQL append-only:
   ```bash
   # Desde Render Shell:
   pnpm --filter @pulso/db triggers
   ```

## 6. Web pública · Vercel

`apps/web/vercel.json` ya configurado.

1. New Project → Import desde GitHub.
2. **Root Directory**: `apps/web`.
3. Framework: Next.js (auto-detectado).
4. Env vars:
   - `NEXT_PUBLIC_API_URL=https://api.pulso.health`
   - `NEXT_PUBLIC_SITE_URL=https://pulso.health`
5. Custom domain: `pulso.health`.

## 7. Admin · Vercel (segundo proyecto)

`apps/admin/vercel.json` ya configurado.

1. New Project → mismo repo.
2. **Root Directory**: `apps/admin`.
3. Env: `NEXT_PUBLIC_API_URL=https://api.pulso.health`.
4. Custom domain: `admin.pulso.health`.
5. **Importante**: configurar IP allowlist desde Vercel → Project → Settings → Deployment Protection. Solo personal autorizado.

## 8. Mobile · EAS Build

```bash
cd apps/mobile
npx eas-cli build --platform all --profile production
npx eas-cli submit --platform all
```

OTA updates posteriores: `npx eas-cli update --branch production`.

## 9. DNS

Configurar en tu DNS provider (Cloudflare recomendado):

| Subdominio | Tipo | Apunta a |
| --- | --- | --- |
| `pulso.health` | CNAME | `cname.vercel-dns.com` |
| `admin.pulso.health` | CNAME | `cname.vercel-dns.com` |
| `api.pulso.health` | CNAME | `pulso-api.onrender.com` |

## 10. Post-deploy checklist

- [ ] `https://api.pulso.health/api/health/ready` devuelve 200 con `database.ok=true` y `auditChain.ok=true`.
- [ ] `https://pulso.health` carga la landing.
- [ ] Crear cuenta de prueba via `/registro` y verificar que el email llega (Resend logs).
- [ ] Subir un PDF de prueba al perfil y verificar en R2 que está cifrado en reposo.
- [ ] Generar QR de emergencia, escanearlo, verificar que llega notificación.
- [ ] `/api/admin/audit/verify` (con token de SUPERADMIN) devuelve `ok: true`.
- [ ] Configurar Sentry si querés monitoreo de errores.

## 11. Rollback rápido

```bash
# Render
render rollback pulso-api --to-deploy <previous-deploy-id>

# Vercel
vercel rollback https://pulso.health
```

## 12. Costos estimados (USD/mes, 1k usuarios activos)

| Servicio | Costo |
| --- | --- |
| Render web (api) Starter | $7 |
| Render cron | $5 |
| Supabase Pro (Postgres + PITR) | $25 |
| Cloudflare R2 (10 GB + egreso) | ~$2 |
| Resend (10k emails) | $20 |
| Twilio WhatsApp (5k msgs) | ~$50 |
| Vercel (web + admin Hobby) | $0 |
| **Total** | **~$110/mes** |
| Anthropic Claude (Mica, opcional) | variable según uso |

A 100k usuarios, todos los costos escalan ~10×, total ~$1.000/mes (ARS ~1M con dólar oficial).

---

## Comandos rápidos

```bash
# Ver logs de api en Render
render logs pulso-api --tail

# Ver migraciones aplicadas
pnpm --filter @pulso/db prisma migrate status

# Aplicar migraciones manualmente en producción
pnpm --filter @pulso/db migrate:deploy
pnpm --filter @pulso/db triggers
```
