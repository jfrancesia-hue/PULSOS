# Pulso API · Referencia

Base URL: `http://localhost:3001/api`
Swagger UI: `http://localhost:3001/api/docs`

> Todas las respuestas son JSON. El header `Content-Type: application/json` se asume en requests con body.
> Endpoints **autenticados** requieren `Authorization: Bearer <accessToken>` (obtenido via `/auth/login`).

---

## Convenciones

### Respuestas exitosas

```json
{ "ok": true, "data": <payload> }
```

### Respuestas con error

```json
{
  "ok": false,
  "error": { "code": "FORBIDDEN", "message": "Rol insuficiente: ..." },
  "path": "/api/clinical/search",
  "timestamp": "2026-05-01T12:34:56.789Z"
}
```

### Códigos de error frecuentes

| Código | Significado |
| --- | --- |
| `UNAUTHORIZED` | Falta o expiró el access token. |
| `INVALID_TOKEN` | El token no verifica firma o issuer/audience. |
| `FORBIDDEN` | Rol insuficiente o consent ausente. |
| `MFA_REQUIRED` | Rol exige MFA y no fue satisfecho en login. |
| `CONSENT_REQUIRED` | Profesional intenta acceso clínico sin consent vigente. |
| `HTTP_429` | Rate limit excedido. |
| `HTTP_404` | Recurso inexistente o expirado. |

---

## Endpoints

### Health

| Método | Path | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/health` | público | Healthcheck simple. |

### Auth

| Método | Path | Auth | Descripción |
| --- | --- | --- | --- |
| POST | `/auth/signup` | público | Crear cuenta CIUDADANO. Body: `{ email, password }`. |
| POST | `/auth/login` | público | Login con email + password. Devuelve tokens. |
| POST | `/auth/refresh` | público | Refresh tokens. Body: `{ refreshToken }`. |
| POST | `/auth/logout` | bearer | Invalida sesión (logging only). |
| GET | `/auth/me` | bearer | Datos del usuario autenticado. |

### Pulso ID — perfil ciudadano (rol CIUDADANO)

| Método | Path | Descripción |
| --- | --- | --- |
| GET | `/pulso-id/me` | Mi perfil completo. |
| PATCH | `/pulso-id/me` | Actualizar nombre, apellido, localidad, teléfono. |
| PATCH | `/pulso-id/me/alergias` | Reemplazar lista de alergias. |
| PATCH | `/pulso-id/me/medicacion` | Reemplazar medicación habitual. |
| PATCH | `/pulso-id/me/condiciones` | Reemplazar condiciones críticas. |
| PATCH | `/pulso-id/me/contacto-emergencia` | Setear contacto de emergencia. |
| PATCH | `/pulso-id/me/cobertura` | Setear cobertura médica. |
| GET | `/pulso-id/me/documentos` | Listar mis documentos clínicos. |
| GET | `/pulso-id/me/consentimientos` | Listar consents otorgados. |

### Emergency — QR de emergencia

| Método | Path | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/emergency/public/:token` | **público** (rate limit 10/min/IP) | Vista pública con datos críticos. |
| GET | `/emergency/me` | bearer | Mis QR (activo + histórico). |
| POST | `/emergency/me` | bearer | Crear nuevo QR. Body: `{ ttl: "H_24" \| "D_7" \| "D_30" \| "NUNCA" }`. |
| DELETE | `/emergency/me/:qrId` | bearer | Revocar QR propio. |
| GET | `/emergency/me/:qrId/logs` | bearer | Accesos a un QR. |

### Clinical — portal profesional (rol PROFESIONAL)

| Método | Path | Descripción |
| --- | --- | --- |
| GET | `/clinical/search?dni=:dni` | Buscar paciente. Devuelve perfil completo si hay consent, o solo nombre parcial + flag `consent_required`. |
| POST | `/clinical/consent/request` | Solicitar consent. Body: `{ ciudadanoDni, scopes[], motivo }`. **Modo demo:** crea consent vigente por 7 días. |
| GET | `/clinical/citizen/:citizenId/timeline` | Timeline clínico (requiere consent vigente con scope `TIMELINE_CLINICO`). |
| POST | `/clinical/evolucion` | Cargar evolución. Body: `{ ciudadanoId, tipo, titulo, descripcion? }`. Requiere consent con scope `CARGA_EVOLUCION`. |

### Mica — IA acompañante

| Método | Path | Auth | Descripción |
| --- | --- | --- | --- |
| POST | `/mica/chat` | bearer | Body: `{ conversation: [{ role, content }], citizenContext? }`. Devuelve respuesta + triage + flag `prescriptionFlagged`. **Si no hay `ANTHROPIC_API_KEY`, responde mock seguro.** |

### Admin — gestión (rol ADMIN o SUPERADMIN, MFA exigido)

| Método | Path | Descripción |
| --- | --- | --- |
| GET | `/admin/metrics` | Conteos: usuarios, ciudadanos, profesionales, instituciones, QRs, audits. |
| GET | `/admin/users?q=&role=` | Buscar usuarios. |
| PATCH | `/admin/users/:id/role` | Cambiar rol. Body: `{ role }`. |
| PATCH | `/admin/users/:id/status` | Suspender / activar. Body: `{ status }`. |
| GET | `/admin/institutions?q=` | Listar instituciones. |
| GET | `/admin/professionals` | Listar profesionales. |
| GET | `/admin/emergency-accesses` | Listar QR generados. |
| GET | `/admin/audit?limit=&action=` | Audit log. |
| GET | `/admin/audit/verify` | Verificar integridad del hash chain. |

### Connect — interoperabilidad

| Método | Path | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/connect/status` | bearer | Estado de la capa Connect (preview). |

---

## Rate limiting

Configurado vía `@nestjs/throttler`. Globalmente:

- Default: 60 req/min por IP.
- `/auth/login`, `/auth/signup`: 5 req/min por IP.
- `/auth/refresh`: 10 req/min por IP.
- `/emergency/public/:token`: 10 req/min por IP.

429 al exceder. Codex puede ajustar en `apps/api/src/app.module.ts`.

---

## Ejemplo end-to-end

```bash
# 1. Login como ciudadana
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana.martini@pulso.demo","password":"Pulso2026!"}'

# Respuesta:
# { "ok": true, "data": { "accessToken": "...", "refreshToken": "...", "role": "CIUDADANO" } }

# 2. Ver perfil
TOKEN="<accessToken>"
curl http://localhost:3001/api/pulso-id/me -H "Authorization: Bearer $TOKEN"

# 3. Generar nuevo QR de emergencia
curl -X POST http://localhost:3001/api/emergency/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ttl":"D_30"}'

# 4. Acceder a la vista pública (sin token)
curl http://localhost:3001/api/emergency/public/<token>
```
