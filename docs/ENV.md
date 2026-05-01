# Pulso · Variables de entorno

Cada app tiene su propio `.env` (mirá `*.env.example`). Esta guía explica qué hace cada una y dónde se usa.

---

## Globales (raíz `.env`)

### Base de datos

| Variable | Requerida | Default | Notas |
| --- | --- | --- | --- |
| `DATABASE_URL` | ✅ | — | Connection string Postgres. Local: `postgresql://pulso:pulso@localhost:5432/pulso?schema=public`. |
| `DIRECT_URL` | ⭕ | igual a DATABASE_URL | Conexión directa para migraciones (Supabase usa pooler, queremos bypassearlo en migrate). |

### Auth

| Variable | Requerida | Default | Notas |
| --- | --- | --- | --- |
| `JWT_SECRET` | ✅ | — | Cadena aleatoria larga (≥64 chars). Usá `openssl rand -hex 64`. |
| `JWT_ACCESS_EXPIRES_IN` | ⭕ | `15m` | Vencimiento del access token. |
| `JWT_REFRESH_EXPIRES_IN` | ⭕ | `14d` | Vencimiento del refresh token. |

### IA (Pulso Mica)

| Variable | Requerida | Default | Notas |
| --- | --- | --- | --- |
| `ANTHROPIC_API_KEY` | ⭕ | — | Sin esto, Mica responde con mock seguro (sin afectar guardrails). Para producción, key real. |
| `ANTHROPIC_MODEL` | ⭕ | `claude-sonnet-4-6` | Modelo a usar. Haiku para clasificación, Sonnet para conversación. |

### Audit log

| Variable | Requerida | Default | Notas |
| --- | --- | --- | --- |
| `AUDIT_HASH_SALT` | ✅ producción | — | Salt para hash determinístico de payloads. Cambiar entre tenants/instalaciones. |

### URLs públicas

| Variable | Requerida | Default | Notas |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | ✅ web/admin | `http://localhost:3001` | URL base del API NestJS. |
| `NEXT_PUBLIC_SITE_URL` | ⭕ | `http://localhost:3000` | URL canonical de la landing pública. Para metadata OpenGraph. |
| `NEXT_PUBLIC_ADMIN_URL` | ⭕ | `http://localhost:3002` | URL del admin (no se usa en runtime, solo para docs/links cross-app). |

---

## apps/api (`apps/api/.env`)

```
NODE_ENV=development
PORT=3001
DATABASE_URL=...           # ver arriba
JWT_SECRET=...
ANTHROPIC_API_KEY=sk-ant-...
AUDIT_HASH_SALT=...
CORS_ORIGINS=http://localhost:3000,http://localhost:3002
```

| Variable | Notas |
| --- | --- |
| `PORT` | Default 3001. Si lo cambiás, ajustar `NEXT_PUBLIC_API_URL` en web y admin. |
| `CORS_ORIGINS` | Lista coma-separada de orígenes permitidos. En producción agregar dominios reales. |

---

## apps/web (`apps/web/.env`)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Variables prefijadas con `NEXT_PUBLIC_` quedan disponibles en el bundle del cliente.

---

## apps/admin (`apps/admin/.env`)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Secretos en producción (futuro)

Cuando se despliegue a Vercel/Render, estas variables van en el dashboard de cada plataforma — **nunca** commiteadas:

| Variable | Crítico | Comentario |
| --- | --- | --- |
| `JWT_SECRET` | 🔴 | Rotar trimestralmente o ante incidente. |
| `AUDIT_HASH_SALT` | 🔴 | No rotar (rompería verificación de chain previa). |
| `ANTHROPIC_API_KEY` | 🟠 | Rotar si se filtra. |
| `DATABASE_URL` | 🔴 | Production usa Supabase/RDS — no checkear nunca. |
| `RESEND_API_KEY` | 🟡 | Cuando se active email transaccional. |
| `TWILIO_AUTH_TOKEN` | 🟡 | Cuando se active WhatsApp. |
| `EXPO_ACCESS_TOKEN` | 🟡 | Para EAS Build de mobile. |

---

## Generar secrets seguros

```bash
# JWT_SECRET, AUDIT_HASH_SALT, etc.
openssl rand -hex 64

# Si no hay openssl (Windows nativo):
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
