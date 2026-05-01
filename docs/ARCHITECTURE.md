# Pulso · Architecture

> Decisiones técnicas, diagramas, flujos críticos.

---

## Principios arquitectónicos

1. **Separación clara entre dominio y framework**. La lógica de negocio (RBAC, audit, consentimiento, hash chain) vive en `packages/` y no depende de NestJS, Next.js ni Prisma.
2. **El ciudadano es el dueño del dato**. Toda decisión de modelado y autorización empieza en el `User` ciudadano.
3. **Append-only por defecto**. Los datos clínicos y los accesos no se editan ni se borran: se versionan o se invalidan.
4. **Trazabilidad sin blockchain**. Hash chain SHA-256 en `AuditLog` + firmas digitales (futuras). No web3.
5. **Anthropic-first para IA**. Claude es la única familia de modelos permitida (memoria del usuario).
6. **Datos plausibles en demos**. Seeds usan "Nativos Consultora" + DNIs/CUITs con dígito verificador válido.

---

## Vista de alto nivel

```
                                    ┌──────────────────────┐
                                    │      Ciudadanos      │
                                    │    (Web + Mobile)    │
                                    └──────────┬───────────┘
                                               │
   ┌──────────────────┐                        │                          ┌──────────────────┐
   │  Profesionales   │                        │                          │     Gobiernos    │
   │  (apps/web /     │◄───────────────┐       │       ┌─────────────────►│  (apps/admin)    │
   │   portal pro)    │                │       │       │                  └──────────────────┘
   └──────────────────┘                │       │       │
                                       ▼       ▼       ▼
                              ┌────────────────────────────────────┐
                              │            apps/api (NestJS)        │
                              │  ┌──────────────────────────────┐  │
                              │  │ Auth + RBAC (6 roles)        │  │
                              │  │ Audit middleware (hash chain)│  │
                              │  │ Zod validation pipes          │  │
                              │  └──────────────────────────────┘  │
                              │  ┌──────┬──────┬──────┬─────────┐  │
                              │  │ ID   │ Emer │ Clin │ Mica IA │  │
                              │  │      │ gncy │ ical │ (Claude)│  │
                              │  └──────┴──────┴──────┴─────────┘  │
                              └────────┬───────────────────────────┘
                                       │
                              ┌────────┴───────────┐
                              │  PostgreSQL + pgvector
                              │  (Prisma 7 ORM)    │
                              └────────────────────┘
```

---

## Stack y justificación

### Turborepo + pnpm workspaces

- Compartir `types`, `ui`, `db`, `auth` entre 4 apps sin duplicación.
- pnpm es estricto con dependencias fantasma (matters en seguridad).
- Turborepo cachea builds (especialmente útil con NestJS + Next.js).

### NestJS para API

- Estructura modular por bounded context coincide con módulos Pulso.
- DI nativa facilita testing.
- Guards, interceptors y pipes encajan perfectamente con RBAC + audit + Zod.
- Comunidad fuerte y patrones consolidados.

### Next.js 16 (App Router) para Web y Admin

- Server Components reducen JS en cliente (importante en context govtech).
- Streaming + suspense ideal para timeline clínico y dashboards.
- Misma codebase para SSR público (landing) y app autenticada (admin).

### Expo + React Native para Mobile

- Stack único (TypeScript) con web.
- OTA updates críticos para fixes de seguridad sin pasar por stores.
- Acceso a cámara (QR), notificaciones, biometría.

### Prisma 7 (vs Drizzle)

**Decisión: Prisma 7.**

| Criterio | Prisma | Drizzle |
| --- | --- | --- |
| DX seed/migrate | ✅ excelente, declarativo | ⚠️ verboso |
| Soporte pgvector | ✅ vía preview + driver adapter | ✅ nativo |
| Studio para demos | ✅ killer feature | ❌ |
| Tipos en runtime | ✅ generados | ✅ inferidos |
| Adopción Nativos | ✅ ya en CryptoHub, MenuAI, FacturAI | ❌ |
| Performance edge | ⚠️ requiere driver adapter | ✅ nativo |

Pulso prioriza **DX**, **Studio para demostrar a stakeholders no-técnicos** y **consistencia con otros proyectos del equipo**. Para casos de extrema necesidad de performance edge, se puede mover queries específicas a SQL crudo via `prisma.$queryRaw`.

### PostgreSQL 16 + pgvector

- Estándar en LATAM.
- Extensión `pgvector` para embeddings de Pulso Mica (búsqueda semántica de documentos clínicos).
- Soporte excelente en Supabase y proveedores cloud (AWS RDS, Render, Railway).

### Anthropic Claude

- Único proveedor de IA permitido en el ecosistema Nativos.
- Sonnet 4.6 para Mica conversacional, Haiku 4.5 para clasificación rápida y guardrails.
- Prompt caching para reducir costos en conversaciones largas.

---

## Modelo de datos (resumen)

Detalle completo en `packages/db/prisma/schema.prisma`. Diagrama lógico:

```
User ─┬─ CitizenProfile ─┬─ EmergencyAccess (QR + log)
      │                  ├─ ClinicalRecord ── ClinicalDocument
      │                  ├─ Consent
      │                  └─ MicaConversation
      │
      ├─ ProfessionalProfile ── (matrícula, especialidades)
      │
      └─ InstitutionMembership ── Institution
                                   │
                                   └─ AuditLog (append-only, hash chain)
```

**Reglas críticas**:

- `AuditLog` es **append-only** a nivel SQL (no se permite UPDATE/DELETE — lo enforce con triggers).
- Cada fila de `AuditLog` incluye `previousHash` y `currentHash`. La integridad de la cadena se verifica cron-job.
- `Consent` versiona cada autorización. Revocar = nueva fila con `revokedAt`.
- `ClinicalDocument` referencia archivos en object storage (S3-compatible). Los binarios **no** viven en Postgres.

---

## Capa de seguridad

### Roles (RBAC)

```
SUPERADMIN     → operación de Pulso (Nativos staff). MFA obligatorio.
ADMIN          → admin de institución. MFA obligatorio.
INSTITUCION    → cuenta institucional (clínica/hospital). API access.
PROFESIONAL    → médico/bioquímico/etc. matriculado.
FARMACIA       → cuenta farmacia (validación de recetas).
CIUDADANO      → titular de cuenta personal. El default.
```

### Flujo de autorización

```
Request ──► JWT verify ──► Role guard ──► Scope guard (¿este profesional puede ver
            (firma)        (rol mínimo)   este paciente? ¿hay consentimiento vigente?)
            ──► Audit middleware (registra acceso) ──► Controller
```

### Audit log con hash chain

```
fila N:
  id, timestamp, actorId, actorRole, action, targetType, targetId,
  payloadHash (SHA-256 del payload sensible),
  previousHash (currentHash de fila N-1),
  currentHash  (SHA-256(previousHash + datos canónicos de la fila N))
```

Verificación: scan secuencial cada 24h. Fila inconsistente → alerta crítica.

### Datos clínicos en logs

Prohibido. Los logs estructurados (Pino, Winston) **nunca** contienen:

- Nombres reales de medicación
- Diagnósticos
- Notas de evolución
- Resultados de estudios

Sí pueden contener: `userId` (UUID), `action`, `timestamp`, `outcome` (success/failure).

---

## Flujos críticos

### 1. Acceso a QR de emergencia

```
1. Profesional escanea QR (URL pública: /q/{token})
2. apps/web carga vista pública minimalista
3. apps/api endpoint público con rate limit (10 req/min/IP):
   - Valida token (firmado, con expiración configurable)
   - Verifica ciudadano activo
   - Registra acceso en EmergencyAccess + AuditLog
   - Devuelve solo datos críticos (grupo sanguíneo, alergias, contacto, condiciones)
   - Trigger asincrónico: notifica al ciudadano (push + email)
4. Si el QR está expirado o revocado: 404 con mensaje claro
```

### 2. Profesional consulta paciente

```
1. Profesional logueado busca por DNI/CUIL
2. apps/api verifica:
   - Profesional tiene rol PROFESIONAL activo y matrícula vigente
   - Existe Consent vigente del ciudadano hacia ese profesional o institución
3. Si NO hay consent: devuelve 403 con flag "consent_required" + mecanismo
   para solicitar consentimiento (notificación al ciudadano)
4. Si hay consent: devuelve perfil clínico, registra acceso en AuditLog
```

### 3. Mica responde a ciudadano

```
1. Ciudadano envía mensaje a Mica
2. apps/api → packages/ai → Anthropic Claude:
   - System prompt incluye guardrails de no-prescripción
   - Contexto: últimos N mensajes + perfil clínico relevante (con consent del propio ciudadano)
   - Prompt caching para system + perfil
3. Respuesta pasa por filtro post-hoc (no menciona dosis, no diagnostica)
4. Se registra MicaConversation (sin contenido literal, solo metadata)
```

---

## Observabilidad (futuro)

- **Sentry** para errores de runtime (apps/web + apps/api).
- **OpenTelemetry** para traces distribuidos.
- **Pino** + **structured logs** en JSON con correlation IDs.
- **Grafana / Prometheus** para métricas en producción.

Todo configurado pero off por default en development.

---

## Despliegue (futuro)

- **apps/api** → Render o Fly.io (containers + autoscaling).
- **apps/web + apps/admin** → Vercel (preview por PR).
- **PostgreSQL** → Supabase (managed) o RDS (gobierno on-prem).
- **Object storage** → S3-compatible (Cloudflare R2 / AWS S3 / MinIO on-prem).
- **CI** → GitHub Actions con gitleaks + lint + typecheck + test + build matriz.

Decisiones específicas por entorno se documentan en `docs/DEPLOYMENT.md` (a crear por Codex).
