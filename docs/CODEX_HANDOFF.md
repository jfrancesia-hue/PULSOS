# Pulso · Codex Handoff

> Checklist exhaustivo y priorizado para que **Codex (OpenAI Codex CLI)** continúe el desarrollo de Pulso.
>
> **Lee primero**: `README.md`, `CLAUDE.md`, `docs/PRODUCT_VISION.md`, `docs/ARCHITECTURE.md`, `docs/MVP_SCOPE.md`, `docs/DESIGN_SYSTEM.md`.

---

## Lo que Claude dejó hecho

✅ Estructura monorepo Turborepo + pnpm workspaces.
✅ Documentación completa: README, CLAUDE.md, 5 docs de producto.
✅ Configs raíz: `.env.example`, `.gitignore`, `tsconfig.base.json`, `prettier`, `editorconfig`.
✅ `packages/types` — DTOs, enums y tipos compartidos.
✅ `packages/ui` — design tokens completos y stub de componentes core.
✅ `packages/db` — schema Prisma 7 con todos los modelos del MVP, generator con `driverAdapters`, pgvector preview, seed con "Nativos Consultora".
✅ `packages/auth` — RBAC con 6 roles, helpers JWT, guards.
✅ `packages/audit` — audit log append-only con hash chain SHA-256.
✅ `apps/web` — Next.js 16 con landing pública premium (hero + 9 secciones).
✅ `apps/api` — NestJS 10 con módulos auth, users, pulso-id, emergency, clinical, mica, admin, connect (stub).
✅ `apps/admin` — Next.js 16 con dashboard enterprise.
✅ `apps/mobile` — Expo + React Native con pantallas Pulso ID, QR, Mica.

---

## Pendiente — alta prioridad (P0)

### P0.1 · Setup local end-to-end verificado

- [ ] Instalar pnpm y correr `pnpm install` desde raíz.
- [ ] Levantar PostgreSQL local con `pgvector` (o usar Supabase).
- [ ] Crear `.env` real con `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `ANTHROPIC_API_KEY`.
- [ ] Correr `pnpm db:generate && pnpm db:migrate && pnpm db:seed`.
- [ ] Verificar `pnpm dev` levanta web (3000), api (3001), admin (3002) sin errores.
- [ ] Verificar `pnpm typecheck && pnpm lint` pasan en todo el monorepo.

### P0.2 · Auth real end-to-end

- [ ] Implementar login + signup con bcrypt en `apps/api`.
- [ ] JWT access + refresh tokens, rotación segura.
- [ ] Endpoint `/auth/me` con guard.
- [ ] MFA (TOTP) opcional para CIUDADANO, **obligatorio** para ADMIN y SUPERADMIN.
- [ ] Recuperación de contraseña con token expirable.
- [ ] Rate limit en `/auth/login`, `/auth/signup`, `/auth/reset-password` (5 req/min).
- [ ] Tests unitarios `packages/auth` >80% coverage.

### P0.3 · Pulso ID — flujo completo

- [ ] CRUD perfil ciudadano con validación Zod.
- [ ] Subida de documentos a object storage (S3-compatible). Mock con MinIO local.
- [ ] Endpoints REST documentados con OpenAPI (`@nestjs/swagger`).
- [ ] UI mobile y web para edición de perfil.

### P0.4 · Pulso Emergency — QR funcional

- [ ] Generación de token firmado con TTL configurable.
- [ ] Endpoint público `/api/emergency/:token` con rate limit 10 req/min/IP.
- [ ] Pantalla pública en `apps/web` (`/q/[token]`) sin auth, optimizada para mobile.
- [ ] Notificación email al ciudadano en cada acceso (Resend o nodemailer + SMTP).
- [ ] Push notification a la app mobile (Expo Push).

### P0.5 · Pulso Clinical — flujo profesional

- [ ] Búsqueda de paciente por DNI/CUIL con verificación de consentimiento.
- [ ] Si no hay consent: emitir solicitud + flujo de aceptación del ciudadano.
- [ ] Carga de evolución con audit log.
- [ ] Visualización del timeline clínico.

### P0.6 · Pulso Mica — IA con guardrails

- [ ] Wrapper Anthropic en `packages/ai` con system prompt versionado.
- [ ] Implementar prompt caching (cache control en system prompt + perfil).
- [ ] Validador post-hoc de respuesta (regex + LLM judge con Haiku) para detectar prescripción.
- [ ] Endpoint `/mica/chat` con streaming SSE.
- [ ] UI chat en mobile y web.

### P0.7 · Audit log con hash chain

- [ ] Triggers SQL en `AuditLog` que prohíben UPDATE y DELETE.
- [ ] Job cron diario que verifica integridad del chain.
- [ ] Endpoint admin `/admin/audit/verify-chain?from=&to=` con resultado.

---

## Pendiente — media prioridad (P1)

### P1.1 · Apps/admin completo

- [ ] Tabla de usuarios con paginación, búsqueda, filtros, acciones masivas.
- [ ] Tabla de instituciones.
- [ ] Vista de auditoría con filtros avanzados.
- [ ] Dashboard de métricas con gráficos reales (no mocks).
- [ ] Mapa de Argentina con datos epidemiológicos por provincia (mock inicial, real cuando haya data).

### P1.2 · Mobile app

- [ ] Login con biometría (Face ID / Touch ID via expo-local-authentication).
- [ ] Notificaciones push (Expo Push).
- [ ] Modo offline básico (cache de perfil clínico para emergencias).
- [ ] Configuración de OTA updates.

### P1.3 · Tests

- [ ] Unit tests `packages/auth`, `packages/audit`, `packages/ai` >80%.
- [ ] Integration tests `apps/api` por módulo, base de datos efímera (testcontainers).
- [ ] E2E tests en `apps/web` y `apps/admin` con Playwright.
- [ ] Smoke test en mobile con Detox o Maestro.

### P1.4 · CI/CD

- [ ] GitHub Actions: lint + typecheck + test + build matriz por app.
- [ ] gitleaks como step obligatorio.
- [ ] Dependabot config para todos los workspaces.
- [ ] Preview deploys en Vercel para web y admin por cada PR.

### P1.5 · Observabilidad

- [ ] Sentry en web, admin y api.
- [ ] Pino con structured logs en api.
- [ ] OpenTelemetry traces (opt-in via env).

### P1.6 · Storage y archivos

- [ ] MinIO local en docker-compose para desarrollo.
- [ ] Adapter S3 para producción (Cloudflare R2 o AWS S3).
- [ ] Validación MIME + tamaño + escaneo antivirus (ClamAV opcional).

---

## Pendiente — baja prioridad (P2)

### P2.1 · Pulso Connect — primera integración real

- [ ] OAuth 2.0 server (`@nestjs/passport-oauth2-server`).
- [ ] OpenAPI spec navegable en `/docs/api`.
- [ ] Conector demo HL7v2 en `packages/integrations/hl7`.
- [ ] Webhook receiver con verificación HMAC.

### P2.2 · Recetas digitales

- [ ] Modelo `Prescription` en Prisma.
- [ ] Firma electrónica (futuro: integración con AFIP/firmar.gob.ar).
- [ ] Validación en farmacia.

### P2.3 · Tablero epidemiológico real

- [ ] Endpoint agregado por provincia + condición.
- [ ] Mapa interactivo en admin con drill-down.
- [ ] Alertas configurables por umbral.

### P2.4 · Multi-tenant institucional

- [ ] Aislamiento por institución (row-level con `institutionId`).
- [ ] Branding personalizado.
- [ ] Configuración de políticas (TTL de QR, MFA mandatory, etc.).

---

## Compliance y legal (paralelo)

- [ ] Política de privacidad alineada con Ley 25.326.
- [ ] Términos y condiciones revisados por legal.
- [ ] Marco de consentimiento informado alineado con Ley 26.529.
- [ ] DPA (Data Processing Agreement) template para instituciones.
- [ ] Análisis de impacto en protección de datos (DPIA).

---

## Performance budget

- Landing pública: LCP <2.5s, CLS <0.1, FID <100ms en 4G.
- Admin dashboard: TTI <3s con 10K filas en tablas.
- API: p95 <300ms en endpoints autenticados.
- Mica chat: TTFB <1s, completion total <5s en respuestas típicas.

---

## Comandos para Codex

```bash
# Empezar siempre con
pnpm install
pnpm db:generate
pnpm typecheck

# Trabajar en una sola app
pnpm --filter @pulso/api dev
pnpm --filter @pulso/web dev

# Verificar antes de commitear
pnpm lint && pnpm typecheck && pnpm test

# Migración nueva
pnpm --filter @pulso/db prisma migrate dev --name <nombre>
```

---

## Convención de PRs

Cada PR debe:

1. Tocar **un solo módulo Pulso** o una capa transversal clara.
2. Incluir tests para lógica nueva.
3. Pasar `lint`, `typecheck`, `test` y gitleaks en CI.
4. Tener título conventional commit: `feat(emergency): ...` / `fix(clinical): ...`.
5. Linkear el item del handoff que resuelve (`Cierra P0.4`).

---

## Cuando dudar, pregunta esto

- ¿Esto puede afectar a datos clínicos? → Doble verificación de RBAC, consent, audit.
- ¿Esto introduce una nueva dependencia? → Justificar en el PR. Auditar licencia y mantenimiento.
- ¿Esto introduce una IA? → Solo Anthropic. Solo con guardrails.
- ¿Esto requiere blockchain? → **No**. Re-leer CLAUDE.md.
- ¿Esto necesita una API key? → No inventar. Pedir al usuario o dejar `// TODO_REAL_KEY:` con contexto.
