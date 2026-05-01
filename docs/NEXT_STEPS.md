# Pulso · Próximos pasos

> Estado al cierre de esta entrega (Claude continuando como Codex). Lo siguiente que conviene hacer, ordenado por urgencia.

---

## 🟢 Hoy (lo que ya quedó listo)

- ✅ Monorepo Turborepo con 4 apps + 8 packages.
- ✅ Auth real con guards JWT + RBAC + decorators.
- ✅ Endpoints completos: auth, pulso-id, emergency (público + privado), clinical (con consent), mica (con mock fallback), admin (con MFA enforcement).
- ✅ Panel ciudadano: login + 7 páginas (home, perfil, QR, historial, documentos, consentimientos, Mica).
- ✅ Portal profesional: login + dashboard + búsqueda + paciente con timeline + carga evolución + auditoría.
- ✅ Admin: dashboard + usuarios + instituciones + profesionales + accesos QR + auditoría + connect.
- ✅ Mobile: 4 pantallas Expo.
- ✅ Audit log con hash chain SHA-256 verificable end-to-end.
- ✅ Mica con mock seguro cuando no hay `ANTHROPIC_API_KEY`.
- ✅ Middleware Next.js de protección de rutas en web y admin.
- ✅ Tests unitarios en `packages/auth` y `packages/audit`.
- ✅ Docs: README, CLAUDE.md, INSTALL, ENV, API, DEMO_SCRIPT, PITCH_NOTES, PRODUCT_VISION, ARCHITECTURE, DESIGN_SYSTEM, MVP_SCOPE, CODEX_HANDOFF.
- ✅ docker-compose.yml para Postgres + pgvector.

---

## 🟡 Próximas 2-3 semanas (alta prioridad)

### Producto
- [ ] **Onboarding ciudadano** — `/registro` + flujo de creación de Pulso ID con DNI, cobertura, contacto. Hoy solo se puede crear cuenta sin perfil.
- [ ] **Subida de archivos real** — adapter S3-compatible (Cloudflare R2 o AWS S3). El stub de `documentos` está listo para conectarse.
- [ ] **Notificaciones email reales** (Resend o SES). El dispatcher stub está en `packages/notifications`.
- [ ] **Push mobile** con Expo Notifications cuando alguien escanea el QR de un ciudadano.
- [ ] **MFA real** con TOTP forzado para ADMIN/SUPERADMIN. La librería ya está en `packages/auth/src/mfa.ts`.

### Seguridad
- [ ] **Triggers SQL** en `AuditLog` que prohíban UPDATE/DELETE (en migration de Prisma).
- [ ] **Cron job** que verifica integridad del hash chain cada 24h y alerta.
- [ ] **CSRF tokens** si el sistema pasa a usar cookies cross-origin.
- [ ] **gitleaks** en pre-commit local (ya está en CI).
- [ ] **Hash de IP** antes de almacenar (Ley 25.326).

### Calidad
- [ ] **Tests E2E** con Playwright en web y admin (login, navegación, generar QR, cargar evolución).
- [ ] **Tests integration** del API por módulo con base efímera (testcontainers).
- [ ] **Coverage >80%** en `packages/auth`, `packages/audit`, `packages/ai`.
- [ ] **Storybook** o equivalente para `packages/ui`.

---

## 🟠 Próximas 4-8 semanas (media prioridad)

### Funcionalidades
- [ ] **Verificación real de matrícula profesional** (integración con colegios de médicos por provincia).
- [ ] **Verificación de DNI** vía RENAPER o foto + OCR.
- [ ] **Recetas digitales** con firma electrónica (ANMAT-compatible).
- [ ] **Recordatorios de medicación** persistentes con job cron.
- [ ] **WhatsApp Mica** con Twilio Business API.
- [ ] **OAuth 2.0 server** para que terceras apps pidan permiso al ciudadano (similar a "Sign in with Apple" pero para salud).

### Infraestructura
- [ ] **Sentry** en api, web, admin.
- [ ] **OpenTelemetry** traces.
- [ ] **Pino** structured logs en api.
- [ ] **Grafana / Prometheus** para métricas de producción.
- [ ] **CDN** para documentos clínicos (Cloudflare R2 + Workers).

### Compliance
- [ ] **DPIA** completa (Data Protection Impact Assessment).
- [ ] **Política de privacidad** redactada por legal.
- [ ] **DPA template** para instituciones partner.
- [ ] **Auditoría externa** de seguridad pre-piloto.

---

## 🔵 Roadmap V1 (3-6 meses)

- [ ] **Pulso Connect — primer hospital piloto** con HL7v2 + FHIR R4.
- [ ] **App mobile en stores** (iOS App Store + Google Play). Hoy queda en Expo Go.
- [ ] **Tablero epidemiológico real** con datos agregados anonimizados.
- [ ] **OTA updates** para mobile (Expo Updates).
- [ ] **Modo offline** en mobile (cache de perfil clínico para emergencias).
- [ ] **Biometría** en mobile (Face ID / Touch ID).

---

## 🟣 Roadmap V2 (12-18 meses)

- [ ] **Federación con ministerios provinciales**.
- [ ] **Integración con top 5 obras sociales** del país.
- [ ] **Marketplace de estudios** entre laboratorios.
- [ ] **Mica con multimodalidad** (audio + imagen).
- [ ] **Despliegue on-premise** para gobiernos sensibles (modelos LLM locales).
- [ ] **Expansión LATAM** (Uruguay, Chile, Colombia, México).

---

## 🚫 Lo que NO hay que hacer (para evitar drift)

- ❌ **No introducir blockchain.** Está prohibido en `CLAUDE.md`.
- ❌ **No reemplazar Anthropic Claude** por otra IA sin pedido explícito.
- ❌ **No mockear datos en frontend** "para mostrar". Backend devuelve, o empty state.
- ❌ **No cambiar de stack sin justificar.** Turborepo + NestJS + Next.js + Expo + Prisma están elegidos.
- ❌ **No commitear secretos.** gitleaks corre en CI.
- ❌ **No agregar terminología cripto/web3** a copy o código.

---

## Recomendaciones de deploy

| Componente | Plataforma | Notas |
| --- | --- | --- |
| `apps/api` | Render o Fly.io | Containers + autoscaling. Postgres en Supabase managed. |
| `apps/web` | Vercel | Preview por PR. Edge runtime para `/q/[token]`. |
| `apps/admin` | Vercel (proyecto separado) | Acceso restringido por dominio o IP allowlist. |
| `apps/mobile` | Expo EAS Build | OTA updates. Stores cuando quede en V1. |
| Postgres | Supabase (managed) o RDS | PITR habilitado. Replicas leídas en 2 zonas. |
| Object storage | Cloudflare R2 | Compatible con S3 API. Más barato que S3. |
| Email | Resend | Transactional. Dominio propio. |
| WhatsApp | Twilio Business | Cuando se habilite Mica WhatsApp. |
| Monitoring | Sentry + Better Stack | APM + uptime. |

---

## Para retomar esta sesión en el futuro

1. Leer este archivo + `TODO_CODEX.md` + `docs/CODEX_HANDOFF.md`.
2. Hacer `pnpm install && pnpm db:migrate && pnpm db:seed`.
3. Levantar `pnpm dev` y verificar las 4 apps.
4. Tomar la primera tarea no completada de `TODO_CODEX.md` (sección "Pendiente").
5. Crear branch `feature/<modulo>-<descripcion>` y abrir PR cuando esté listo.
