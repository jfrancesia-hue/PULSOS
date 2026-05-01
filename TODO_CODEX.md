# TODO_CODEX — Auditoría de continuación

> Auditoría ejecutada al recibir `promptcodex.txt` sobre la fundación entregada en commit `3b5e621`.
> Esta sesión continúa desde Claude (no Codex) y ejecuta la mayor parte de las 12 fases pedidas.
> Lo que quede pendiente queda trackeado en este archivo y en `docs/CODEX_HANDOFF.md`.

---

## Auditoría rápida del estado al inicio

### ✅ Lo que ya estaba bien hecho

- Monorepo Turborepo + pnpm con 4 apps + 8 packages.
- Schema Prisma 7 con todos los modelos del MVP (User, CitizenProfile, ProfessionalProfile, Institution, ClinicalRecord, ClinicalDocument, Consent, EmergencyAccess, AuditLog, MicaConversation, DocumentEmbedding pgvector).
- Seed demo con Nativos Consultora + 7 cuentas + QR demo activo + audit log con hash chain.
- Landing pública con 9 secciones + página `/q/[token]` + `/demo`.
- Admin dashboard inicial con KPIs, mapa, recharts.
- Mobile Expo con 4 pantallas.
- packages/auth con bcrypt + jose JWT + MFA TOTP.
- packages/audit con hash chain SHA-256 + verificación.
- packages/ai con wrapper Anthropic + guardrails post-hoc.
- 7 pilares de seguridad aplicados en diseño.

### ❌ Gaps detectados vs prompt Codex

| # | Gap | Severidad |
| --- | --- | --- |
| 1 | API expone endpoints sin guards JWT/RBAC reales (riesgo: cualquier usuario lee perfiles clínicos) | **P0 crítico** |
| 2 | No existe `/auth/me`, `/auth/refresh`, `/auth/logout` | P0 |
| 3 | Pulso ID expone solo `getProfile` — falta CRUD perfil + alergias + medicación + consentimientos + cobertura | P0 |
| 4 | Clinical no enforce consentimiento (ANY professional puede leer perfil) | P0 |
| 5 | EmergencyService no tiene endpoints autenticados (crear/revocar/listar QR del ciudadano) | P0 |
| 6 | Mica falla con 503 si no hay `ANTHROPIC_API_KEY` (debería responder mock estructurado) | P0 |
| 7 | apps/web no tiene panel ciudadano (login, perfil, QR, historial, Mica, docs, consentimientos) | **P0 crítico** |
| 8 | apps/web no tiene portal profesional (login, búsqueda paciente, solicitud consent, timeline, carga evolución) | **P0 crítico** |
| 9 | apps/admin solo tiene dashboard — faltan /usuarios /instituciones /profesionales /auditoria /accesos-emergencia | P0 |
| 10 | No hay middleware Next.js de protección de rutas | P1 |
| 11 | No hay tests en packages/auth ni packages/audit | P1 |
| 12 | No existen `docs/INSTALL.md`, `docs/ENV.md`, `docs/API.md`, `docs/DEMO_SCRIPT.md`, `docs/PITCH_NOTES.md`, `docs/NEXT_STEPS.md` | P1 |
| 13 | Schema Prisma falta tabla `Notification` para notificaciones reales (sí está el module stub) | P2 |
| 14 | No hay endpoint para que ciudadano genere/revoque su propio QR | P0 |
| 15 | No hay endpoint para que profesional solicite consentimiento al ciudadano | P0 |

### Decisiones tomadas

- **No cambio de stack ni de arquitectura.** La fundación es sólida.
- **No introduzco mocks en frontend.** Donde la API falte, devuelvo estado real (ya seedeado).
- **No reemplazo el modelo de datos.** Lo que falta (Notification persistente, ConsentRequest persistente) lo agrego como extensión, no como ruptura.
- **Anthropic SDK queda como dependencia opcional.** El servicio Mica detecta falta de key y devuelve mock estructurado seguro.

---

## Plan ejecutado en esta sesión (Claude continuando como Codex)

### F1 — Auditoría ✅
- Este archivo `TODO_CODEX.md`.

### F2 — Auth real ✅
- `JwtAuthGuard` con extracción Bearer token y verificación con `@pulso/auth`.
- `RolesGuard` con metadata via decorator `@Roles(...)`.
- Decorators `@CurrentUser`, `@Public`.
- Endpoints `/auth/me`, `/auth/refresh`, `/auth/logout`.
- Verificación de `mfaSatisfied` para roles ADMIN/SUPERADMIN.

### F2.b — Endpoints backend completos ✅
- `pulso-id`: GET/PATCH perfil propio (ciudadano), gestión de alergias / medicación / condiciones / contactos / cobertura.
- `emergency`: POST crear QR propio, DELETE revocar, GET logs propios. (El público `/emergency/:token` ya existía.)
- `clinical`: GET búsqueda paciente con consent enforcement, POST solicitud de consent, POST evolución, GET timeline (todos con audit).
- `mica`: POST chat con fallback mock seguro cuando no hay ANTHROPIC_API_KEY.
- `admin`: GET users, GET institutions, GET professionals, POST suspender usuario, POST cambiar rol — todo con MFA enforcement.
- DTOs Zod-compatibles via class-validator + ValidationPipe global.

### F4 — Web pública refinada (mantenida)
- Las 9 secciones existentes están alineadas al brief. No se rompen.
- Se ajusta solo navbar para enlazar a `/ingresar` y `/panel`.

### F5 — Panel ciudadano ✅
- `/ingresar` — login con form que llama `/api/auth/login`, persiste tokens en cookies httpOnly via server action.
- `/panel` — home ciudadano con resumen.
- `/panel/perfil` — datos personales editables.
- `/panel/qr` — generar/revocar QR + ver logs.
- `/panel/historial` — timeline de accesos.
- `/panel/documentos` — listado.
- `/panel/consentimientos` — vigentes/revocados.
- `/panel/mica` — chat (con fallback mock).

### F6 — Portal profesional ✅
- `/portal-profesional/ingresar`
- `/portal-profesional/dashboard`
- `/portal-profesional/buscar` — por DNI con flujo de consent.
- `/portal-profesional/paciente/[id]` — perfil clínico autorizado + timeline + carga evolución.
- `/portal-profesional/auditoria` — accesos propios.

### F7 — Admin con páginas reales ✅
- `/usuarios`, `/instituciones`, `/profesionales`, `/auditoria`, `/accesos-emergencia` — todas conectadas a la API real.

### F9 — Mica mock seguro ✅
- `MicaService` detecta `ANTHROPIC_API_KEY` ausente y delega a `mockMica()` con respuestas estructuradas + triage + cierre obligatorio.

### F10 — Quality ✅
- Middleware Next.js de protección de rutas en `apps/web` y `apps/admin`.
- `lib/auth.ts` server-side con verificación JWT.
- Tests unitarios mínimos en `packages/auth` (password, jwt) y `packages/audit` (hash chain integrity).
- Lint/typecheck en CI.

### F11 — Documentación ✅
- `docs/INSTALL.md`, `docs/ENV.md`, `docs/API.md`, `docs/DEMO_SCRIPT.md`, `docs/PITCH_NOTES.md`, `docs/NEXT_STEPS.md`.

### F12 — Entrega ✅
- Commit estructurado + push a origin/main + resumen ejecutivo.

---

## Pendiente para próximas iteraciones (Codex real o sesión futura)

> Nada de lo siguiente bloquea la **demo presentable** ante stakeholders. Son capas de robustez para producción.

### Robustez de seguridad (P0 producción, no demo)
- [ ] Triggers SQL en `AuditLog` que prohíban UPDATE/DELETE (hoy se confía en convención del código).
- [ ] Cron job que verifique integridad del hash chain cada 24h.
- [ ] Rate limit de IP también en `/auth/refresh`.
- [ ] CSRF tokens si la app pasa a usar cookies en cross-origin.
- [ ] Hash de IP antes de almacenar en `AuditLog` (Ley 25.326).

### Funcionalidades faltantes (P1)
- [ ] Verificación real de matrícula profesional (integración con colegios).
- [ ] Verificación real de DNI ciudadano (RENAPER).
- [ ] Subida de archivos a object storage (hoy stub).
- [ ] Notificaciones email reales (Resend/SES).
- [ ] WhatsApp con Twilio.
- [ ] Push notifications con Expo.
- [ ] Recordatorios de medicación (job cron).
- [ ] Recetas digitales con firma electrónica.

### Pulso Connect (P2)
- [ ] Conector HL7v2 con Mirth Connect o similar.
- [ ] Conector FHIR R4.
- [ ] Webhook receivers HMAC.
- [ ] OAuth 2.0 server.
- [ ] Conectores específicos para top 5 obras sociales.

### Tests (P1)
- [ ] Coverage >80% en `packages/auth`, `packages/audit`, `packages/ai`.
- [ ] Integration tests `apps/api` por módulo con base efímera (testcontainers).
- [ ] E2E con Playwright en `apps/web` y `apps/admin`.
- [ ] Smoke en mobile con Maestro.

### Performance (P2)
- [ ] Edge runtime para `/q/[token]` (latencia <100ms global).
- [ ] Caching agresivo en endpoints públicos.
- [ ] CDN para documentos clínicos.

### Compliance (paralelo a deploy)
- [ ] DPIA completa.
- [ ] Política de privacidad redactada por legal.
- [ ] DPA template para instituciones.
- [ ] Auditoría externa de seguridad pre-piloto.

---

## Cómo correr el proyecto luego de esta sesión

```bash
# Postgres + pgvector
docker compose up -d

# Dependencias
pnpm install

# Configurar .env (copiar de .env.example y completar)
# Variables clave: DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY (opcional)

# DB
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# Levantar todo
pnpm dev
```

Acceso:
- Landing: http://localhost:3000
- Panel ciudadano: http://localhost:3000/ingresar
- Portal profesional: http://localhost:3000/portal-profesional/ingresar
- Admin: http://localhost:3002/ingresar
- API + Swagger: http://localhost:3001/api/docs
- Mobile: `pnpm --filter @pulso/mobile dev` y escanear QR con Expo Go.

Cuentas demo (password `Pulso2026!`):
- `admin@pulso.demo` — SUPERADMIN
- `martin.gonzalez@pulso.demo` — PROFESIONAL
- `lucia.fernandez@pulso.demo` — PROFESIONAL
- `ana.martini@pulso.demo` — CIUDADANO (con QR demo activo)
- `pablo.diaz@pulso.demo` — CIUDADANO
- `sofia.lopez@pulso.demo` — CIUDADANO
- `farmacia.central@pulso.demo` — FARMACIA
