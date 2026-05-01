# Pulso

> **Plataforma de infraestructura sanitaria interoperable de Argentina.**
> Identidad sanitaria, perfil clínico unificado, QR de emergencia, asistente IA y portal profesional — para ciudadanos, profesionales, instituciones, farmacias y gobiernos.

Construido por **[Nativos Consultora Digital](https://nativos.consulting)**.

---

## Tabla de contenidos

- [Visión](#visión)
- [Módulos del MVP](#módulos-del-mvp)
- [Stack técnico](#stack-técnico)
- [Estructura del monorepo](#estructura-del-monorepo)
- [Inicio rápido](#inicio-rápido)
- [Scripts disponibles](#scripts-disponibles)
- [Documentación](#documentación)
- [Seguridad](#seguridad)
- [Estado del proyecto](#estado-del-proyecto)

---

## Visión

Pulso es la **espina dorsal digital del sistema de salud argentino**: una plataforma que unifica la información clínica de cada persona, garantiza acceso seguro en emergencias, conecta profesionales con datos clínicos verificados y prepara la interoperabilidad real entre hospitales, obras sociales, farmacias y laboratorios.

No es otro SaaS de salud. Es una **infraestructura nacional** pensada para escalar desde el ciudadano hasta el ministerio.

Para más contexto, ver **[docs/PRODUCT_VISION.md](./docs/PRODUCT_VISION.md)**.

---

## Módulos del MVP

| Módulo | Producto | Descripción |
| --- | --- | --- |
| **Pulso ID** | Identidad sanitaria | DNI/CUIL, datos personales, contacto de emergencia, cobertura, alergias, condiciones críticas, medicación y consentimientos. |
| **Pulso Emergency** | QR de emergencia | QR personal con datos críticos accesibles en emergencia, log de cada acceso, expiración y notificación al ciudadano. |
| **Pulso Clinical** | Portal profesional | Búsqueda de paciente, vista resumida del perfil clínico, timeline, carga de evolución y documentos, consentimientos. |
| **Pulso Mica** | Asistente IA | Acompañante sanitario en lenguaje simple. Explica estudios, recuerda medicación, triage básico seguro. **No prescribe.** |
| **Pulso Admin** | Panel administrativo | Gestión de usuarios, instituciones, auditoría de accesos, métricas y control de roles. |
| **Pulso Connect** | Interoperabilidad | Capa para conectar hospitales, obras sociales, farmacias y laboratorios. Arquitectura preparada, implementación incremental. |

Ver alcance completo en **[docs/MVP_SCOPE.md](./docs/MVP_SCOPE.md)**.

---

## Stack técnico

- **Monorepo** — Turborepo + pnpm workspaces
- **Backend** — NestJS 10 + TypeScript
- **Web pública** — Next.js 16 (App Router) + Tailwind CSS
- **Admin** — Next.js 16 (App Router) + Tailwind CSS
- **Mobile** — Expo SDK 51 + React Native + TypeScript
- **Base de datos** — PostgreSQL 16 + Prisma 7 + pgvector (preview)
- **IA** — Anthropic Claude (única IA permitida en el ecosistema Nativos)
- **Validación** — Zod v4 en frontend y backend
- **Auth** — JWT + RBAC con 6 roles

Ver decisiones y diagramas en **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**.

---

## Estructura del monorepo

```
pulso/
├── apps/
│   ├── api/          NestJS 10 — API REST + autenticación
│   ├── web/          Next.js 16 — Landing pública institucional
│   ├── admin/        Next.js 16 — Panel admin / institucional
│   └── mobile/       Expo + React Native — App ciudadana
├── packages/
│   ├── types/        DTOs y enums compartidos
│   ├── ui/           Design system (tokens + componentes React)
│   ├── db/           Prisma schema + cliente
│   ├── auth/         RBAC + helpers JWT
│   ├── audit/        Audit log append-only con hash chain
│   ├── ai/           Wrapper Anthropic Claude para Pulso Mica
│   ├── notifications/ Email + WhatsApp (Twilio) + SMS
│   └── integrations/ Conectores hospitales / OS / farmacias / labs
├── docs/             Documentación del producto
└── ...
```

---

## Inicio rápido

### Requisitos

- **Node.js** ≥ 20.11
- **pnpm** ≥ 9.0
- **PostgreSQL** ≥ 15 con extensión `pgvector` instalada
- **Cuenta Anthropic** con API key (para Pulso Mica)

### Instalación

```bash
# Clonar repo
git clone https://github.com/jfrancesia-hue/PULSOS.git
cd PULSOS

# Instalar dependencias
pnpm install

# Configurar entorno
cp .env.example .env
# editar .env con valores reales

# Generar cliente Prisma + migraciones
pnpm db:generate
pnpm db:migrate

# Cargar seed demo (Nativos Consultora + ciudadanos demo)
pnpm db:seed

# Levantar todo en paralelo
pnpm dev
```

### Puertos por defecto

| App | URL |
| --- | --- |
| `apps/web` | http://localhost:3000 |
| `apps/api` | http://localhost:3001 |
| `apps/admin` | http://localhost:3002 |
| `apps/mobile` | Expo (QR + Expo Go) |

---

## Scripts disponibles

```bash
pnpm dev              # Levanta todas las apps en paralelo
pnpm build            # Build productivo de todo el monorepo
pnpm lint             # Lint en todas las apps/packages
pnpm typecheck        # Type-check global
pnpm test             # Tests
pnpm format           # Prettier en todo el repo
pnpm db:generate      # Genera cliente Prisma
pnpm db:migrate       # Aplica migraciones (modo dev)
pnpm db:seed          # Carga datos demo
pnpm db:studio        # Abre Prisma Studio
```

---

## Documentación

| Documento | Contenido |
| --- | --- |
| [PRODUCT_VISION.md](./docs/PRODUCT_VISION.md) | Por qué existe Pulso, propuesta de valor, stakeholders. |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Arquitectura técnica, decisiones, diagramas, flujos críticos. |
| [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) | Tokens, tipografía, color, componentes, principios visuales. |
| [MVP_SCOPE.md](./docs/MVP_SCOPE.md) | Alcance del MVP, prioridades, criterios de aceptación. |
| [CODEX_HANDOFF.md](./docs/CODEX_HANDOFF.md) | Checklist exhaustivo de pendientes para que Codex termine. |

---

## Seguridad

Pulso maneja datos clínicos sensibles. La seguridad es un requisito **desde el día uno**, no un add-on:

1. **Secrets management** — `.env` + `.env.example` + gitleaks pre-commit
2. **RBAC** estricto por roles (6 roles definidos)
3. **Audit log append-only** con hash chain SHA-256 para todo acceso a datos clínicos
4. **Consentimiento explícito** del ciudadano antes de cualquier acceso profesional
5. **Rate limiting** en endpoints públicos (especialmente QR de emergencia)
6. **Validación Zod** en cada capa
7. **Logs sin PII médica** — los logs estructurados nunca contienen datos clínicos

**No usamos blockchain.** La trazabilidad verificable se logra con audit log append-only + hash chain interno + firmas digitales.

---

## Estado del proyecto

🟢 **Fase actual**: Fundación inicial completada por Claude. Lista para que **Codex** continúe el desarrollo según el handoff documentado.

Ver pendientes detallados en **[docs/CODEX_HANDOFF.md](./docs/CODEX_HANDOFF.md)**.

---

**Pulso** · Tu salud, conectada. Segura. Siempre. · _Por Nativos Consultora Digital_
