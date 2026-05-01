Actuá como equipo senior de ingeniería full-stack, QA, DevOps, diseñador UI/UX premium y product engineer.

Vas a continuar el proyecto PULSO iniciado por Claude Code.

Tu objetivo NO es crear otra demo.
Tu objetivo es terminar un MVP funcional, integrado, estable, moderno y presentable ante gobierno, obras sociales, clínicas e inversores.

PRODUCTO:
Pulso — plataforma argentina de infraestructura sanitaria interoperable de Nativos Consultora Digital.

IMPORTANTE:
No usar blockchain.
No mencionar blockchain.
No agregar crypto, tokens, web3 ni chaincode.
La auditoría debe resolverse con:
- audit log append-only
- hash chain interno
- trazabilidad verificable
- firmas digitales futuras
- registro criptográficamente verificable

OBJETIVO GENERAL:
Terminar Pulso Core con:
- web pública premium
- panel ciudadano
- portal profesional
- panel admin
- API backend
- base de datos real
- auth por roles
- QR de emergencia
- consentimientos
- auditoría
- seed demo
- documentación
- tests mínimos
- build funcionando

ESTÉTICA FINAL:
Diseño de primer mundo, inspirado en Nativos Consultora Digital pero más moderno.

Debe verse:
- institucional
- premium
- humano
- argentino
- tecnológico
- cálido
- confiable
- enterprise

Usar:
- azul profundo
- turquesa
- cobre/naranja
- fondos claros cálidos
- imágenes reales tipo salud/Argentina
- imágenes 3D médicas modernas
- líneas topográficas
- mapas abstractos
- cards glass premium
- dashboards elegantes
- animaciones suaves
- buen espaciado
- tipografía seria
- responsive perfecto

Evitar:
- diseño genérico
- hospital viejo
- estilo cripto
- interfaces vacías
- componentes sin pulir
- placeholders eternos
- lorem ipsum

TAREAS PRINCIPALES:

FASE 1 — Auditoría
1. Revisar todo el repo.
2. Leer README, CLAUDE.md y docs/CODEX_HANDOFF.md.
3. Detectar errores de arquitectura.
4. Detectar módulos incompletos.
5. Crear plan de ejecución en TODO_CODEX.md.

FASE 2 — Backend/API
Completar API con NestJS:
- auth
- usuarios
- perfiles
- roles
- ciudadanos
- profesionales
- instituciones
- farmacias
- perfil clínico
- alergias
- medicación
- condiciones críticas
- contactos emergencia
- documentos
- consentimientos
- QR emergencia
- accesos de emergencia
- auditoría
- notificaciones
- endpoints IA iniciales

Todos los endpoints deben tener:
- DTOs
- validación
- guards por rol
- manejo de errores
- respuestas consistentes
- logs seguros
- tests básicos donde corresponda

FASE 3 — Base de datos
Completar schema:
- users
- roles
- user_roles
- citizens
- professionals
- organizations
- pharmacies
- clinical_profiles
- allergies
- medications
- critical_conditions
- emergency_contacts
- documents
- consents
- emergency_qr_tokens
- emergency_access_logs
- audit_events
- ai_conversations
- notifications

Agregar:
- migraciones
- seed demo
- datos realistas argentinos
- usuarios por rol
- instituciones demo
- pacientes demo
- profesional demo
- admin demo

FASE 4 — Web pública
Terminar landing institucional premium con:
- hero impactante
- imagen real/3D
- narrativa de problema país
- propuesta de valor
- módulos Pulso
- Pulso ID
- Pulso Emergency
- Pulso Mica
- Pulso Clinical
- Pulso Analytics futuro
- Pulso Connect futuro
- sección gobierno
- sección obras sociales
- sección profesionales
- sección ciudadanos
- CTA para solicitar piloto
- footer institucional

Textos en español argentino.
Tono serio, moderno y persuasivo.

FASE 5 — Panel ciudadano
Crear experiencia funcional:
- login
- home ciudadano
- perfil sanitario
- alergias
- medicación
- condiciones críticas
- contactos emergencia
- cobertura
- documentos
- consentimientos
- QR emergencia
- historial de accesos
- asistente Mica básico

FASE 6 — Portal profesional
Crear:
- login profesional
- dashboard
- búsqueda paciente
- solicitud de acceso
- vista perfil clínico autorizado
- timeline
- carga evolución
- carga documento
- alertas críticas
- auditoría visible

FASE 7 — Admin
Crear:
- dashboard general
- usuarios
- instituciones
- profesionales
- ciudadanos
- accesos de emergencia
- auditoría
- métricas
- configuración
- seeds visibles

FASE 8 — QR emergencia
Debe funcionar realmente:
- generar QR único por ciudadano
- página pública segura de emergencia
- mostrar sólo datos críticos
- registrar acceso
- mostrar fecha/hora
- permitir expiración o revocación
- diseño mobile-first
- impresión/export simple

FASE 9 — Mica IA inicial
Implementar asistente inicial seguro:
- interfaz chat
- respuestas mockeadas estructuradas si no hay API key
- preparado para conectar OpenAI/Claude después
- reglas de seguridad:
  - no prescribe
  - no diagnostica definitivo
  - recomienda consultar profesional
  - deriva a emergencia ante síntomas críticos
- guardar conversación
- opción recordatorio medicación

FASE 10 — Calidad
Agregar:
- validaciones
- loaders
- empty states
- error states
- responsive
- accesibilidad básica
- contraste correcto
- manejo de sesiones
- protección de rutas
- tests mínimos
- lint limpio
- build funcionando

FASE 11 — Documentación
Actualizar:
- README.md
- docs/INSTALL.md
- docs/ENV.md
- docs/ARCHITECTURE.md
- docs/API.md
- docs/DEMO_SCRIPT.md
- docs/PITCH_NOTES.md
- docs/NEXT_STEPS.md

FASE 12 — Entrega final
Dejar:
- proyecto corriendo local
- comandos claros
- usuarios demo
- seed demo
- checklist de estado
- bugs conocidos
- próximos pasos
- recomendaciones de deploy

CRITERIOS DE ACEPTACIÓN:
El proyecto se considera terminado cuando:

1. Puedo levantarlo con comandos claros.
2. Hay web pública premium.
3. Hay login por roles.
4. Hay panel ciudadano.
5. Hay portal profesional.
6. Hay admin.
7. El QR de emergencia funciona.
8. El perfil clínico se guarda en base de datos.
9. Los accesos sensibles generan auditoría.
10. Hay seed demo.
11. No hay referencias a blockchain.
12. El diseño se ve moderno, premium y serio.
13. El build pasa.
14. La documentación permite continuar sin perder contexto.

MODO DE TRABAJO:
- No romper lo que ya funciona.
- No cambiar stack sin justificar.
- No crear mocks si se puede conectar a backend real.
- No dejar pantallas vacías.
- No usar lorem ipsum.
- No inventar dependencias innecesarias.
- Si algo está mal diseñado, refactorizar.
- Si hay deuda técnica, documentarla.
- Priorizar producto funcional y presentable.

ENTREGA:
Al finalizar, generar un resumen:
- qué se terminó
- qué falta
- cómo correrlo
- usuarios demo
- rutas principales
- variables de entorno
- próximos pasos recomendados

Objetivo final:
Pulso debe quedar como un MVP institucional premium, funcional, demostrable y listo para presentar a una provincia, obra social, clínica o inversor.