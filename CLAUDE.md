# CLAUDE.md — Instrucciones para agentes IA en este repo

> Este archivo es leído automáticamente por Claude Code (y similar) al trabajar en el monorepo. Contiene contexto, convenciones y guardrails específicos de **Pulso**.

---

## Identidad del proyecto

- **Producto**: Pulso — Plataforma de salud digital argentina.
- **Empresa**: Nativos Consultora Digital.
- **Arquetipo de marca**: institucional, argentina, humana, tecnológica, premium. Se compara con Apple Health, One Medical, Oscar Health y plataformas govtech modernas.
- **Tono**: español argentino institucional. Nunca infantil, nunca cripto, nunca SaaS genérico.

---

## Principios no negociables

### 1. Sin blockchain

Está **prohibido** introducir cualquier referencia a blockchain, crypto, token, chaincode, web3 o smart contracts. La trazabilidad verificable se hace exclusivamente con:

- audit log append-only en Postgres
- hash chain SHA-256 interno
- firmas digitales (futuro: HSM/KMS)
- registro criptográficamente verificable

### 2. Datos clínicos = sensibles

Cada vez que toques un endpoint, guard, query o componente que muestre datos clínicos, asegurar:

- Consentimiento del ciudadano registrado y vigente.
- Acceso registrado en `AuditLog`.
- Notificación al ciudadano cuando aplique.
- No exponer PII médica en logs estructurados.

### 3. Anthropic Claude es la única IA permitida

Para Pulso Mica y cualquier feature de IA, usar exclusivamente la **Anthropic SDK** (`@anthropic-ai/sdk`). No introducir OpenAI, Gemini, Mistral u otros sin pedido explícito.

### 4. Mica no prescribe

Pulso Mica responde, explica, recuerda y deriva — pero **nunca** indica medicación, dosis ni diagnósticos. Cada respuesta debe pasar por un guardrail explícito de "no clínica vinculante".

### 5. Datos demo reales

En seeds y mocks usar **"Nativos Consultora"** como institución demo y datos plausibles argentinos (DNIs ficticios pero válidos por dígito verificador, obras sociales reales, partidos de Buenos Aires, etc.). **Nunca** "Empresa Demo SRL", "Acme Corp", `sk-xxxxx`, etc.

---

## Convenciones de código

### Nombres

- Carpetas y archivos en **kebab-case**.
- Componentes React en **PascalCase**.
- Variables, funciones y hooks en **camelCase**.
- Enums y constantes globales en **SCREAMING_SNAKE_CASE**.
- Modelos Prisma en **PascalCase singular** (`User`, `CitizenProfile`, `EmergencyAccess`).

### Idioma en código

- **Comentarios y mensajes de UI**: español argentino.
- **Identificadores de código**: inglés (estándar de la industria), con excepción de identificadores de dominio sanitario argentino que ya tienen nombre propio (`obraSocial`, `cuit`, `dni`).

### Imports

- Aliases internos del monorepo: `@pulso/types`, `@pulso/ui`, `@pulso/db`, `@pulso/auth`, `@pulso/audit`, `@pulso/ai`.
- Imports relativos solo dentro del mismo paquete.

### Validación

- **Zod v4** en todo límite de confianza (DTOs API, formularios, params).
- En NestJS usar pipes con `ZodValidationPipe`. En Next.js usar `zodResolver` con React Hook Form.

### Errores

- Errores tipados con clases de dominio (`UnauthorizedAccessError`, `ConsentRequiredError`, etc.).
- Nunca `throw 'string'`. Nunca `catch` silencioso.

---

## Stack y versiones

| Capa | Tecnología | Versión |
| --- | --- | --- |
| Runtime | Node.js | 20.11 LTS |
| Package manager | pnpm | 9.x |
| Monorepo | Turborepo | 2.x |
| Backend | NestJS | 10.x |
| Web | Next.js | 16 (App Router) |
| Mobile | Expo | SDK 51 |
| ORM | Prisma | 7.x |
| DB | PostgreSQL + pgvector | 16 |
| IA | Anthropic SDK | última estable |

### Gotchas conocidos (Next.js 16 + Prisma 7)

- `buttonVariants` en server components: extraer a archivo sin `"use client"`.
- `asChild` no existe en `@base-ui/react` (este proyecto usa shadcn-style con base-ui). Usar `<Link className={cn(buttonVariants(...))}>`.
- Prisma 7: `url` y `directUrl` van en `prisma.config.ts`, no en `schema.prisma`. Requiere `previewFeatures = ["driverAdapters"]` y `@prisma/adapter-pg`.
- Zod v4: usar `error:` en lugar de `invalid_type_error:`.
- `Select` `onValueChange`: tipar `(v: string | null) => ...`.

---

## Convenciones de commits

[Conventional Commits](https://www.conventionalcommits.org/):

```
feat(emergency): agregar expiración de QR a 24h por defecto
fix(api): RBAC negaba acceso a admin en /clinical/search
docs(handoff): actualizar checklist de Pulso Connect
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`.

---

## Flujo de trabajo recomendado para Codex

1. Leer **`docs/CODEX_HANDOFF.md`** — checklist priorizado.
2. Tomar la primera tarea no completada.
3. Crear branch `feature/<modulo>-<descripcion-corta>`.
4. Ejecutar tests locales (`pnpm test`) y typecheck (`pnpm typecheck`) antes de commitear.
5. Hacer PR con descripción que mencione el módulo Pulso afectado.

---

## Lo que NO hay que hacer

- Mockear datos en frontend "para mostrar". Si no hay backend, devolver `null`/`[]` y mostrar empty states reales.
- Inventar API keys, tokens, credenciales. Si falta una key real, decirlo explícitamente y dejar `// TODO_REAL_KEY:` con contexto.
- Acoplar lógica de dominio a frameworks. La lógica de RBAC, audit, consentimiento vive en `packages/`.
- Ignorar `prefers-reduced-motion`. Las animaciones GSAP deben respetarlo.
- Subir secretos al repo (gitleaks corre en pre-commit y CI).
