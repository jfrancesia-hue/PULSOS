# Pulso · Guía de instalación local

> Tiempo estimado: **15-20 minutos** desde cero.

---

## Requisitos

| Herramienta | Versión mínima | Cómo instalar |
| --- | --- | --- |
| Node.js | 20.11 LTS | [nodejs.org](https://nodejs.org) o `fnm install 20.11.0` |
| pnpm | 9.0 | `corepack enable && corepack prepare pnpm@9.12 --activate` |
| Docker | 24+ | [docker.com/get-started](https://www.docker.com/get-started) |
| Git | 2.40+ | preinstalado en macOS/Linux, [git-scm.com](https://git-scm.com) en Windows |

---

## 1. Clonar el repo

```bash
git clone https://github.com/jfrancesia-hue/PULSOS.git pulso
cd pulso
```

## 2. Instalar dependencias

```bash
pnpm install
```

> Si pnpm no está disponible: `npm install -g pnpm@9.12`. En Windows, asegurate de habilitar Corepack: `corepack enable`.

## 3. Levantar PostgreSQL + pgvector

Hay un `docker-compose.yml` listo en la raíz:

```bash
docker compose up -d
```

Verificá que está corriendo:

```bash
docker compose ps
# debería mostrar pulso-postgres en estado "running" / "healthy"
```

## 4. Variables de entorno

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env
```

Editá los `.env` para asegurarte que:

- `DATABASE_URL=postgresql://pulso:pulso@localhost:5432/pulso?schema=public` (raíz + apps/api)
- `JWT_SECRET=<algo aleatorio largo>` (apps/api/.env y .env raíz)
- `ANTHROPIC_API_KEY=sk-ant-...` (opcional — sin esto Mica usa mock seguro)
- `AUDIT_HASH_SALT=<algo aleatorio>` (apps/api/.env)

Para detalles de cada variable, ver **[ENV.md](./ENV.md)**.

## 5. Inicializar la base de datos

```bash
pnpm db:generate    # genera el cliente Prisma
pnpm db:migrate     # crea las tablas
pnpm db:triggers    # aplica triggers SQL append-only en AuditLog (idempotente)
pnpm db:seed        # carga datos demo (Nativos Consultora + 7 usuarios)
```

> **Atajo:** `pnpm db:setup` corre `migrate:deploy + triggers + seed` en orden.

Si todo va bien deberías ver:

```
✅ Seed completo.
─────────────────────────────────────────────
Cuentas demo (contraseña: Pulso2026!)
─────────────────────────────────────────────
  · admin@pulso.demo            — SUPERADMIN
  · martin.gonzalez@pulso.demo  — PROFESIONAL
  · ana.martini@pulso.demo      — CIUDADANO
  ...
  · QR demo activo de Ana Martini → token: <token>
```

## 6. Levantar todo en paralelo

```bash
pnpm dev
```

Esto arranca via Turborepo:

| App | URL | Notas |
| --- | --- | --- |
| Landing pública | http://localhost:3000 | Hero, módulos, /demo, /q/:token |
| Panel ciudadano | http://localhost:3000/ingresar | Login + /panel/* |
| Portal profesional | http://localhost:3000/portal-profesional/ingresar | Búsqueda, consent, evolución |
| Admin | http://localhost:3002/ingresar | Solo ADMIN/SUPERADMIN |
| API | http://localhost:3001/api | Endpoints autenticados |
| Swagger | http://localhost:3001/api/docs | Documentación OpenAPI |
| Health | http://localhost:3001/api/health/ready | Readiness con DB + audit chain |
| MailHog | http://localhost:8025 | Bandeja de emails locales (verificación, recetas, alertas) |
| MinIO console | http://localhost:9001 | Storage de documentos clínicos (user `pulso` / `pulso-minio-dev`) |

Para mobile (en otra terminal):

```bash
pnpm --filter @pulso/mobile dev
# Escaneá el QR con Expo Go (iOS/Android)
```

## 7. Probar el flujo end-to-end

1. Abrí http://localhost:3000 → ver landing.
2. Click "Solicitar demo" o ir a /ingresar.
3. Login con `ana.martini@pulso.demo` / `Pulso2026!`.
4. Ingresar al panel → ver perfil, QR activo, historial.
5. Generar nuevo QR, copiar link, abrirlo en otra ventana → ver datos críticos públicos.
6. Volver y ver el acceso registrado en /panel/historial.
7. Logout, login con `martin.gonzalez@pulso.demo` (profesional).
8. /portal-profesional/buscar → DNI `32145678` (Ana) → tiene consent (creado en seed) → ver perfil.
9. Cargar evolución → ver en timeline.
10. Logout, login con `admin@pulso.demo`.
11. http://localhost:3002 → ver dashboard, audit log, hash chain íntegro.

## Comandos comunes

```bash
pnpm dev                       # levanta todo
pnpm build                     # build productivo
pnpm lint                      # lint global
pnpm typecheck                 # type-check global
pnpm test                      # tests (audit + auth)
pnpm format                    # prettier en todo el repo

pnpm --filter @pulso/api dev   # solo API
pnpm --filter @pulso/web dev   # solo web
pnpm --filter @pulso/admin dev # solo admin

pnpm db:studio                 # Prisma Studio (UI de la DB)
pnpm db:seed                   # re-seedea (NO destructivo del esquema, pero re-crea filas)
```

## Resolver problemas

### "DATABASE_URL no está definido"

Asegurate de tener `.env` en `packages/db/` y `apps/api/`. El `pnpm db:generate` lee desde `packages/db/.env` (que vos creás copiando del raíz si no existe).

### "Cuenta bloqueada temporalmente"

Si fallaste muchas veces el login, el campo `lockedUntil` se completa. Re-corré `pnpm db:seed` o resetealo manualmente con Prisma Studio.

### "ANTHROPIC_API_KEY no está configurada"

No es bloqueante. Mica detecta la falta de key y devuelve respuestas mockeadas estructuradas. Para activar IA real, completar la variable.

### El admin redirige a /ingresar y no me deja entrar

Necesitás un usuario con rol ADMIN o SUPERADMIN. El seed crea `admin@pulso.demo`. Si lo perdiste, re-corré `pnpm db:seed`.
