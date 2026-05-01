Actuá como arquitecto senior full-stack, director de producto, diseñador UI/UX premium y CTO técnico.

Vamos a construir PULSO, una plataforma de infraestructura sanitaria interoperable creada por Nativos Consultora Digital.

IMPORTANTE:
No quiero una demo superficial.
No quiero mockups vacíos.
No quiero beta incompleta.
Quiero una base real, escalable, profesional, lista para que luego Codex termine el desarrollo completo.

NOMBRE DEL PRODUCTO:
Pulso

IDENTIDAD:
Pulso es una plataforma de salud digital argentina que conecta ciudadanos, profesionales, instituciones, farmacias y gobiernos mediante identidad sanitaria, perfil clínico unificado, QR de emergencia, acompañante sanitario por IA, portal profesional, panel administrativo e interoperabilidad futura.

NO USAR BLOCKCHAIN.
Eliminar completamente cualquier referencia a blockchain, crypto, token, chaincode o web3.
Para auditoría usar:
- audit log append-only
- hash chain interno
- firmas digitales
- trazabilidad verificable
- registro criptográficamente verificable

MARCA VISUAL:
Debe sentirse como una evolución premium de Nativos Consultora Digital:
- territorial
- argentina
- institucional
- moderna
- humana
- tecnológica
- confiable
- cálida
- de primer mundo

Estética visual:
- azul profundo institucional
- turquesa Nativos
- naranja/cobre mineral
- blanco cálido
- fondos con textura sutil
- líneas topográficas
- mapas abstractos
- fotografía documental realista
- imágenes 3D médicas modernas
- glassmorphism moderado
- tarjetas premium
- sombras suaves
- microinteracciones
- animaciones sobrias
- dashboard tipo enterprise
- diseño comparable a Apple Health, One Medical, Oscar Health, Palantir y plataformas govtech modernas

Evitar:
- estética hospital vieja
- SaaS genérico
- Bootstrap básico
- cards aburridas
- exceso de emojis
- estética cripto
- diseño infantil

STACK DEFINITIVO:
Monorepo:
- pnpm workspace o turborepo

Apps:
- apps/api → NestJS + TypeScript
- apps/web → Next.js + TypeScript + Tailwind
- apps/admin → Next.js + TypeScript + Tailwind
- apps/mobile → Expo + React Native + TypeScript

Packages:
- packages/ui
- packages/db
- packages/auth
- packages/types
- packages/audit
- packages/ai
- packages/notifications
- packages/integrations

Base de datos:
- PostgreSQL
- Prisma o Drizzle, elegir una opción y justificar
- pgvector preparado para IA futura

Auth:
- roles:
  - ciudadano
  - profesional
  - farmacia
  - institucion
  - admin
  - superadmin

MÓDULOS MVP PULSO CORE:

1. Pulso ID
- perfil ciudadano
- DNI/CUIL
- datos personales
- contacto de emergencia
- cobertura médica
- grupo sanguíneo
- alergias
- condiciones críticas
- medicación habitual
- documentos clínicos básicos
- consentimientos

2. Pulso Emergency
- QR personal de emergencia
- pantalla pública segura con datos críticos
- modo acceso rápido
- log de cada acceso
- notificación al ciudadano
- expiración/control de permisos

3. Pulso Clinical
- portal profesional
- búsqueda de paciente
- vista resumida del perfil clínico
- timeline clínico
- carga de evolución
- carga de documento
- visualización de consentimientos

4. Pulso Mica
- asistente sanitario IA inicial
- NO prescribe
- responde en lenguaje simple
- explica estudios cargados
- recuerda medicación
- triage básico seguro
- derivación a guardia/profesional cuando corresponda
- preparado para WhatsApp/Twilio

5. Pulso Admin
- gestión de usuarios
- gestión de instituciones
- auditoría de accesos
- métricas básicas
- panel de actividad
- control de roles

6. Pulso Connect
- capa futura de interoperabilidad
- diseño de APIs
- webhooks
- conectores para hospitales, obras sociales, farmacias y laboratorios
- no implementar todo todavía, pero dejar arquitectura preparada

REQUERIMIENTOS DE SEGURIDAD:
- RLS o permisos estrictos por backend
- RBAC por roles
- auditoría obligatoria de acceso a datos sensibles
- cifrado conceptual preparado
- separación clara de datos sensibles
- validaciones con Zod
- logs seguros sin datos médicos sensibles
- consentimiento antes de acceso profesional
- no exponer datos clínicos sin autorización

REQUERIMIENTOS DE DISEÑO:
Crear un design system propio:
- colores
- tipografías
- componentes
- botones
- cards
- badges
- tablas
- formularios
- layouts
- sidebar
- topbar
- empty states
- loading states
- error states
- gráficos
- componentes de emergencia

La web pública debe incluir:
- hero premium con imagen real/3D
- propuesta de valor
- módulos Pulso
- cómo funciona
- casos de uso
- sección gobierno
- sección obras sociales
- sección ciudadanos
- sección profesionales
- sección emergencia QR
- sección IA Mica
- CTA institucional
- footer serio

Debe tener textos reales en español argentino, tono institucional moderno.

OBJETIVO DE CLAUDE CODE:
1. Leer el proyecto actual si existe.
2. Crear o refactorizar la estructura del monorepo.
3. Crear documentación base.
4. Crear arquitectura limpia.
5. Crear modelos de datos iniciales.
6. Crear frontend visual premium inicial.
7. Crear API base.
8. Crear auth/roles base.
9. Crear seed demo realista.
10. Dejar TODO documentado para que Codex pueda terminar.

ENTREGABLES:
- README.md completo
- CLAUDE.md actualizado
- docs/PRODUCT_VISION.md
- docs/ARCHITECTURE.md
- docs/DESIGN_SYSTEM.md
- docs/MVP_SCOPE.md
- docs/CODEX_HANDOFF.md
- estructura de apps y packages
- base visual premium funcionando
- base backend funcionando
- modelos iniciales
- seed demo
- scripts de instalación
- checklist de pendientes para Codex

MODO DE TRABAJO:
Antes de escribir código:
1. Auditar estructura actual.
2. Proponer plan corto.
3. Ejecutar por fases.
4. No mezclar todo.
5. No avanzar si hay errores críticos.
6. Mantener consistencia de nombres en español.
7. Priorizar calidad sobre cantidad.

Resultado esperado:
Una base sólida, elegante y profesional de Pulso, lista para que Codex termine el producto completo.