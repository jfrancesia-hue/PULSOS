# Pulso · Product Vision

> Tu salud. Conectada. Segura. Siempre.

---

## El problema

El sistema de salud argentino es una **red de silos**. Cada hospital, obra social, farmacia y consultorio mantiene su propia versión incompleta del paciente. Cuando alguien llega a una guardia inconsciente, los profesionales no tienen acceso a su grupo sanguíneo, sus alergias, su medicación habitual ni sus condiciones críticas. Cada año mueren personas por información que existía pero no estaba accesible.

A esto se suma:

- Recetas en papel que se pierden, se falsifican o se duplican.
- Estudios médicos que se repiten porque el resultado anterior está en otra clínica.
- Pacientes crónicos que no tienen una visión unificada de su tratamiento.
- Profesionales que pierden tiempo buscando datos en lugar de atender.
- Gobiernos que no pueden anticipar brotes epidemiológicos por falta de datos en tiempo real.

---

## Por qué ahora

Tres convergencias hacen viable a Pulso en este momento:

1. **Madurez tecnológica** — pgvector, modelos LLM seguros, infraestructura cloud-nativa argentina, identidad digital nacional avanzando.
2. **Voluntad institucional** — ministerios provinciales y nacionales pidiendo interoperabilidad real, obras sociales presionadas por costos, hospitales digitalizando.
3. **Adopción ciudadana** — el QR es ya un gesto cotidiano (pagos, tickets). El ciudadano está listo para llevar su salud en el bolsillo.

---

## La propuesta de valor

Pulso es **una capa horizontal** que se sienta sobre los actores existentes del sistema y los conecta. No reemplaza a hospitales ni a obras sociales: les da una interfaz común y un ciudadano-en-el-centro que ellos no podían construir solos.

| Para quién | Qué le damos |
| --- | --- |
| **Ciudadano** | Identidad sanitaria portátil, QR de emergencia, perfil clínico unificado, recordatorios de medicación, asistente IA cálido. |
| **Profesional** | Búsqueda inmediata del paciente, timeline clínico real, carga simple de evolución, foco en atender (no en buscar datos). |
| **Institución (clínica/hospital)** | API de interoperabilidad, panel de gestión, visibilidad real de su comunidad de pacientes. |
| **Farmacia** | Validación de recetas digitales, seguimiento de tratamientos crónicos. |
| **Obra social** | Reducción de duplicación de estudios, mejor gestión de pacientes crónicos, datos para diseño de planes. |
| **Gobierno (provincia/nación)** | Tablero epidemiológico en tiempo real, capacidad de respuesta a brotes, base para políticas sanitarias data-driven. |

---

## El usuario en el centro

A diferencia de plataformas centradas en la institución, Pulso es **propiedad del ciudadano**:

- El ciudadano decide quién accede a sus datos y cuándo.
- Cada acceso queda registrado, hasheado y notificable.
- El consentimiento es explícito, granular y revocable.
- La cuenta vive con la persona, aunque cambie de obra social, ciudad o profesional.

Este principio dirige cada decisión de producto y arquitectura.

---

## Posicionamiento

Pulso no es:

- ❌ Otra HCE (Historia Clínica Electrónica) institucional.
- ❌ Una app de turnos o de telemedicina.
- ❌ Un marketplace de profesionales.
- ❌ Un wallet cripto o token de salud.

Pulso es:

- ✅ **La identidad sanitaria del ciudadano argentino.**
- ✅ **La capa de interoperabilidad** que la HCE institucional necesita para ser útil afuera de su silo.
- ✅ **Infraestructura nacional** con pretensión de ser parte del aparato cívico (como mi.argentina.gob.ar para identidad).

Comparables internacionales: **MyChart (EE.UU.)**, **Singapore HealthHub**, **Estonia eHealth**, **NHS App (UK)**, **Apple Health** + las capacidades de un tablero **Palantir Foundry** para gobiernos.

---

## Hitos del producto

### MVP (este repo, post-handoff)

- Pulso ID + Pulso Emergency end-to-end.
- Portal profesional con timeline básico.
- Mica IA con guardrails de no-prescripción.
- Panel admin con auditoría de accesos.

### V1 (3-6 meses post-MVP)

- Pulso Connect con primer hospital piloto.
- Recetas digitales con farmacia piloto.
- App mobile en stores (iOS + Android).
- Tablero epidemiológico provincial demo.

### V2 (12-18 meses)

- Federación con ministerios provinciales.
- Integración con obras sociales (top 5 del país).
- Marketplace de estudios entre laboratorios.
- IA Mica con multimodalidad (audio, imagen).

---

## Stakeholders críticos

- **Ministerios de Salud provinciales** — early adopters institucionales.
- **Obras sociales medianas** — primer canal B2B.
- **Hospitales privados con HCE moderna** — primeros conectores reales.
- **Asociaciones profesionales (médicos, bioquímicos, farmacéuticos)** — adopción profesional.
- **Asociaciones de pacientes con enfermedades crónicas** — testimonial y feedback.
- **ANMAT y regulación** — alineamiento desde el día uno.

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
| --- | --- |
| Adopción profesional lenta | Portal Clinical extremadamente simple. Cero fricción para cargar evolución. |
| Resistencia institucional ("ya tengo mi HCE") | Posicionar como capa **complementaria** que no reemplaza, solo conecta. |
| Privacidad y miedo a fuga de datos | Audit log público para el ciudadano + consentimiento granular + auditorías externas regulares. |
| Regulación incierta | Compliance proactivo: Ley 25.326 (Datos Personales), Ley 26.529 (Derechos del Paciente), futuro marco de salud digital. |
| Costos de infraestructura escalando | Arquitectura cloud-agnóstica, datos sensibles cifrados, opción on-premise para gobiernos. |
