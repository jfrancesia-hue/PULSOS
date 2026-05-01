# Pulso · MVP Scope

> Qué entra y qué no entra en el MVP. Criterios de aceptación.

---

## Resumen

El MVP de Pulso entrega los **6 módulos core** en estado **funcional para piloto** (no para producción nacional). El alcance está pensado para:

1. Demostrar a stakeholders institucionales (ministerios, hospitales) la propuesta de valor real.
2. Onboarding del primer hospital piloto con 100-500 ciudadanos demo.
3. Iterar feedback antes de escalar.

---

## Módulos del MVP

### 1. Pulso ID — Identidad sanitaria

**Qué entra**:

- Registro de ciudadano con email + contraseña + verificación.
- Perfil con: DNI, CUIL, nombre completo, fecha nacimiento, sexo, género autopercibido.
- Contacto de emergencia (nombre + teléfono + relación).
- Cobertura médica (obra social + número de afiliado, opcional prepaga).
- Datos clínicos básicos: grupo sanguíneo, factor RH, alergias (free-text + tags), condiciones críticas (DM, HTA, asma, etc.), medicación habitual.
- Documentos clínicos: subida de PDFs/imágenes (estudios, recetas, vacunación).
- Consentimientos: lista de consentimientos vigentes y revocados con timeline.
- Edición y borrado de campos no clínicos. Los clínicos pueden marcarse "verificado por profesional".

**Qué NO entra**:

- Verificación con RENAPER (queda preparado para V1).
- Importación masiva desde HCE de hospital (Pulso Connect lo aborda).
- Historia clínica longitudinal completa (solo eventos cargados manualmente).

**Aceptación**:

- ✅ Un ciudadano puede registrarse, completar su perfil y subir un PDF en menos de 5 minutos.
- ✅ Los datos críticos están disponibles en el QR de emergencia.
- ✅ Cualquier cambio queda en `AuditLog`.

---

### 2. Pulso Emergency — QR de emergencia

**Qué entra**:

- Generación de QR personal por ciudadano (token firmado).
- Configuración de TTL (24h, 7d, 30d, sin expiración) y revocación inmediata.
- Pantalla pública `/q/{token}` con datos críticos: grupo sanguíneo, alergias, condiciones, medicación, contacto de emergencia, obra social.
- Log de cada acceso: timestamp, IP, user-agent, geolocalización aproximada.
- Notificación al ciudadano (email + push, futuro WhatsApp) en cada acceso.
- Mostrar al ciudadano el listado de accesos de los últimos 90 días.

**Qué NO entra**:

- Acceso por NFC (queda para V1).
- Geofencing avanzado (alertas si el QR se accede a >X km del ciudadano).
- Botón "marcar como acceso indebido" con bloqueo automático.

**Aceptación**:

- ✅ El QR se genera y se imprime en una hoja A4 con tipografía clara.
- ✅ La pantalla pública carga en <1.5s en 4G.
- ✅ Cada acceso queda registrado en `EmergencyAccess` + `AuditLog`.
- ✅ La notificación al ciudadano sale en <30s del acceso.

---

### 3. Pulso Clinical — Portal profesional

**Qué entra**:

- Login profesional con verificación de matrícula (campo libre con validación de formato; verificación real con colegios queda para V1).
- Búsqueda de paciente por DNI/CUIL.
- Si no hay consentimiento vigente: solicitud al ciudadano (notificación push + email).
- Si hay consentimiento: vista resumida del perfil clínico:
  - Datos personales (mínimos necesarios).
  - Alergias y condiciones críticas (destacadas visualmente).
  - Medicación habitual.
  - Timeline de últimos 10 eventos clínicos.
- Carga de evolución (texto + opcional adjuntos).
- Carga de documento (PDF/imagen).
- Visualización de consentimientos del paciente.

**Qué NO entra**:

- Recetas digitales con firma electrónica (V1).
- Telemedicina / videollamada (V2).
- Integración con HCE institucional (Pulso Connect).
- Plantillas de evolución (V1).

**Aceptación**:

- ✅ Un profesional puede buscar un paciente, ver su perfil con consent y cargar una evolución en <2 minutos.
- ✅ Sin consent vigente, el sistema bloquea acceso y muestra el flujo de solicitud.
- ✅ Toda lectura de datos clínicos genera fila en `AuditLog`.

---

### 4. Pulso Mica — Asistente IA

**Qué entra**:

- Chat ciudadano ↔ Mica desde web y mobile.
- System prompt con guardrails de no-prescripción (validación post-hoc adicional).
- Capacidades:
  - Responder en lenguaje simple sobre síntomas, medicaciones (informativo), estudios subidos.
  - Recordar medicación (configurable por el ciudadano).
  - Triage básico: "esto requiere guardia ya" / "esto puede esperar a tu médico de cabecera" / "esto es informativo".
  - Derivar: "te recomiendo ver a un cardiólogo en los próximos días" (sin agendar).
- Memoria de conversación (últimos 20 mensajes en contexto, con prompt caching).
- Indicador visible "Mica no reemplaza a un profesional médico".

**Qué NO entra**:

- Voz / audio (V1).
- Imagen (subir foto y que Mica analice — V2).
- Integración WhatsApp / Twilio (preparada técnicamente, no encendida).
- Memoria de largo plazo persistente con embeddings (preparada con pgvector, no implementada).

**Aceptación**:

- ✅ Mica responde en <3s en el 95% de los casos.
- ✅ Nunca da dosis específica de medicación.
- ✅ Nunca diagnostica.
- ✅ Cada conversación queda en `MicaConversation` (metadata, no contenido completo).

---

### 5. Pulso Admin — Panel administrativo

**Qué entra**:

- Login admin con MFA (TOTP).
- Gestión de usuarios (listar, ver, suspender, cambiar rol).
- Gestión de instituciones (alta, edición, suspensión).
- Auditoría de accesos: tabla filtrable de `AuditLog` con búsqueda por usuario, acción, fecha.
- Métricas básicas: usuarios activos, registros nuevos, accesos a QR, conversaciones Mica.
- Verificación de integridad del hash chain (botón "verificar últimas 1000 filas").
- Panel de actividad reciente.

**Qué NO entra**:

- Reportes exportables (PDF/CSV) — V1.
- Gestión de planes y billing (V2 si se vuelve B2B).
- Configuración avanzada de tenant (V2).

**Aceptación**:

- ✅ Un admin puede ver el último acceso de cualquier usuario en <3 clicks.
- ✅ El hash chain del último mes se verifica en <30s.
- ✅ El panel carga en <2s con 10K usuarios mock.

---

### 6. Pulso Connect — Interoperabilidad (preparada, no implementada)

**Qué entra**:

- Diseño de APIs REST (especificación OpenAPI en `docs/api/`).
- Webhooks con firma HMAC-SHA256.
- Schema de eventos: `citizen.created`, `clinical.record.added`, `consent.granted`, etc.
- Stub de conectores: estructura de carpetas en `packages/integrations/` con README de cada conector.

**Qué NO entra**:

- Implementación real de conectores HL7/FHIR (V1).
- OAuth 2.0 server (V1).
- Conectores con HCE específicas (depende de partners).

**Aceptación**:

- ✅ La especificación OpenAPI es navegable en `/docs/api`.
- ✅ Hay un README por conector (hospitales, OS, farmacias, labs) explicando el approach.
- ✅ Los webhooks tienen helper de firma y verificación.

---

## Apps en el MVP

| App | Estado MVP |
| --- | --- |
| `apps/api` | ✅ Funcional con módulos 1-5, stub módulo 6 |
| `apps/web` | ✅ Landing pública premium completa |
| `apps/admin` | ✅ Dashboard funcional con módulos 1, 5 |
| `apps/mobile` | ✅ Pantallas de 1, 2, 4 (Pulso ID, QR, Mica) |

---

## Lo que NO entra en el MVP

- Pagos / billing.
- Telemedicina sincrónica.
- Marketplace de profesionales.
- Programa de afiliados / lealtad.
- Multi-idioma (solo español argentino).
- Multi-país (solo Argentina; arquitectura preparada para LATAM en V2).
- Federación de identidad (RENAPER, mi.argentina.gob.ar).
- App nativa iOS/Android compilada y publicada (queda en Expo Go para piloto).

---

## Definición de "MVP listo"

- 🟢 Los 5 módulos funcionales (1-5) corren end-to-end con seed demo.
- 🟢 Los 7 pilares de seguridad están aplicados (ver CLAUDE.md).
- 🟢 La landing y el admin se ven idénticos a las imágenes referencia.
- 🟢 La cobertura de tests es >50% en `packages/auth`, `packages/audit`, módulos críticos de API.
- 🟢 La documentación está completa y un developer puede levantar el proyecto en <30 min.
- 🟢 El `CODEX_HANDOFF.md` está actualizado con todo lo pendiente.
