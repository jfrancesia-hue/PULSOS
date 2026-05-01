# Contribuir a Pulso

Gracias por sumarte. Este repo está pensado para que **Codex (OpenAI Codex CLI)** continúe el desarrollo a partir de la fundación que dejó Claude Code. Si vos sos un humano contribuyendo, las mismas reglas aplican.

## Antes de empezar

1. Leé `README.md`, `CLAUDE.md`, `docs/PRODUCT_VISION.md`, `docs/ARCHITECTURE.md`, `docs/MVP_SCOPE.md`, `docs/DESIGN_SYSTEM.md`.
2. Mirá `docs/CODEX_HANDOFF.md` para ver qué está priorizado.
3. Levantá el proyecto local (ver README → Inicio rápido).

## Workflow

```
git checkout -b feature/<modulo>-<descripcion>
# trabajá
pnpm lint && pnpm typecheck && pnpm test
git commit -m "feat(emergency): expiración configurable de QR"
git push -u origin feature/<modulo>-<descripcion>
gh pr create --fill
```

## Reglas no negociables

- **Sin blockchain.** Trazabilidad con audit log + hash chain.
- **Mica no prescribe.** Guardrails post-hoc obligatorios en cada cambio del prompt.
- **Anthropic Claude** es la única IA permitida.
- **Datos clínicos en logs** está prohibido. Solo IDs, acciones, outcomes.
- **Consent** vigente requerido antes de exponer datos clínicos a profesionales.
- **Sin secrets** commiteados. gitleaks corre en pre-commit.

## Conventional Commits

`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`.

## PR template

Tu PR debe incluir:

1. Qué módulo Pulso afecta.
2. Item del handoff que cierra (`Cierra P0.4`).
3. Cómo lo testeaste.
4. Capturas si afecta UI.
5. Notas de migración si tocás `packages/db`.
