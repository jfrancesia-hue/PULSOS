# PR · Pulso

**Módulo Pulso afectado:**

- [ ] Pulso ID
- [ ] Pulso Emergency
- [ ] Pulso Clinical
- [ ] Pulso Mica
- [ ] Pulso Admin
- [ ] Pulso Connect
- [ ] Transversal (auth, audit, ui, db, types)

## Resumen

(Qué cambia y por qué.)

## Item del CODEX_HANDOFF que cierra

(Ej: `Cierra P0.4`)

## Cómo lo probaste

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] Probado manualmente (describir)
- [ ] Capturas si afecta UI

## Checklist de seguridad

- [ ] No expone datos clínicos en logs
- [ ] No introduce nuevas API keys o secrets
- [ ] No introduce blockchain ni terminología cripto
- [ ] Consent + audit donde corresponda

## Notas de migración

(Si tocaste `packages/db/prisma/schema.prisma`, ¿cómo migrar?)
