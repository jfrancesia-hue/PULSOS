# Pulso · Guion de demo institucional

> 12-15 minutos. Para ministerios, obras sociales, hospitales y inversores.

---

## Objetivo

Mostrar que Pulso resuelve **un problema real del sistema de salud argentino** con tecnología seria, segura, y diseñada en Argentina.

## Setup previo

- Tener `pnpm dev` corriendo (web 3000, admin 3002, api 3001).
- Tener una cuenta admin lista (ya logueada en otra ventana).
- Estar logueada como Ana Martini (ciudadana) en una segunda ventana.
- Estar como Dr. González (profesional) en una tercera.
- Tener el QR demo de Ana abierto en una pestaña aparte (`/q/<token>`).

---

## Hilo narrativo (3 actos)

### Acto 1 — El problema (3 min)

> "El sistema de salud argentino es una red de silos. Cada hospital, obra social, farmacia y consultorio tiene su propia versión incompleta del paciente."

Mostrar la **landing pública** (http://localhost:3000):

- Hero "Tu salud. Conectada. Segura. Siempre."
- Bajar a la sección de módulos → 6 productos integrados.
- Bajar a "Para gobiernos / obras sociales / profesionales" → mostrar que cada actor tiene un valor claro.

Cierre del acto: *"No es otro SaaS de salud. Es la espina dorsal digital del sistema."*

---

### Acto 2 — La emergencia (4 min)

Cambiar a la ventana de **Ana Martini** (ciudadana).

> "Ana es una persona real con hipertensión y alergia severa a la penicilina. Hace 3 minutos generó su QR de emergencia desde Pulso."

- Mostrar `/panel` → datos críticos visibles, QR activo.
- Click en `/panel/qr` → mostrar el QR.
- Copiar el link público y abrirlo en una **ventana de incógnito** (simulando un profesional ajeno en una guardia).

> "Acá hay una persona inconsciente en una guardia. Sin tiempo. Sin login. Sin red social. Solo esto:"

Mostrar la página pública del QR con:

- Grupo sanguíneo
- **Alergia a Penicilina · severa**
- Hipertensión arterial controlada con Enalapril
- Contacto de emergencia (Carlos, cónyuge, +54 9...)

> "El profesional ya sabe que no puede inyectarle penicilina. Es la diferencia entre la vida y la muerte."

Volver al panel de Ana → **/panel/historial** muestra el acceso recién registrado.

> "Y Ana ya sabe que alguien la atendió en el Hospital Italiano. La auditoría es para ella, no contra ella."

---

### Acto 3 — El profesional, el consent y el sistema (5 min)

Cambiar a la ventana del **Dr. González** (profesional).

> "Es lunes a la mañana. El Dr. González atiende a Ana en su consultorio."

- /portal-profesional/dashboard → "atendé, no busques datos".
- /portal-profesional/buscar → DNI `32145678` → ya tiene consent (creado en seed).
- Mostrar el perfil completo: alergias, condiciones, medicación.
- Ir a `/portal-profesional/paciente/<id>` → timeline real (los registros del seed).
- **Cargar una evolución demo en vivo** ("Control de tensión arterial. TA 130/85. Continúa esquema. Próximo control en 3 meses.").
- Refrescar → ya está en el timeline. Mostrar `/portal-profesional/auditoria` → quedó la fila CLINICAL_RECORD_CREATED.

> "El profesional es eficiente porque el paciente le dio acceso explícito y temporal. Y todo queda registrado."

---

### Acto 4 — Gobierno e instituciones (3 min)

Cambiar al **admin** (http://localhost:3002).

> "Esto es lo que ve un ministerio o un hospital."

- Resumen institucional → KPIs reales, mapa epidemiológico, **hash chain íntegro**.
- /usuarios → listado con DNIs, roles, estados.
- /accesos-emergencia → cada QR con su contador de accesos.
- /auditoria → audit log con SHA-256 visible.

> "Cualquier modificación posterior al log es detectada al verificar la cadena. Esto es lo que ofrecemos al ciudadano: transparencia técnica, no marketing."

Cierre:

> "Pulso es **infraestructura nacional**. No reemplaza a tu HCE. La conecta. Empezá con un piloto de 500 ciudadanos, escalá a 5 millones."

---

## Variantes según audiencia

### Ministerio provincial
- Énfasis en mapa epidemiológico, on-premise, soberanía de datos, Ley 25.326.
- Tiempo a piloto: 90 días.

### Obra social mediana
- Énfasis en reducción de duplicación de estudios, gestión de crónicos, ROI.
- Tiempo a piloto: 60 días.

### Hospital privado con HCE moderna
- Énfasis en Pulso Connect (capa complementaria, no reemplazo), HL7/FHIR.
- Tiempo a piloto: 45 días.

### Inversor
- Énfasis en mercado total, comparables internacionales (NHS App, MyChart, eEstonia), unit economics, defensibilidad.
- Pasar por todos los actos pero más rápido (8 min).

---

## Preguntas frecuentes y respuestas

**¿Por qué no usan blockchain?**
> Auditoría sin overhead. Hash chain SHA-256 sobre Postgres es matemáticamente equivalente a una blockchain privada y mucho más mantenible.

**¿Cómo cumplen con Ley 25.326?**
> Consent explícito, granular y revocable. Datos clínicos cifrados en reposo. Audit log inmutable. Acceso del titular a su propio log.

**¿Funciona offline?**
> No el flujo completo. La pantalla pública del QR se cachea aggresive en el dispositivo del ciudadano para emergencias en zonas con poca señal.

**¿Cuánto cuesta?**
> Modelo B2B2G. Por ciudadano activo / por institución / SLA. Específico por contrato.

**¿Es interoperable con mi HCE actual?**
> Sí, Pulso Connect está diseñado para FHIR R4 + HL7v2. Codex implementa el conector específico por partner en 4-6 semanas.

**¿Qué pasa con la IA si no quiero exponer datos al exterior?**
> Mica corre con Anthropic Claude por default, pero el system prompt y los datos sensibles se cachean. Para gobiernos sensibles, ofrecemos despliegue con modelos on-prem (Llama, Qwen) — el resto del sistema no cambia.
