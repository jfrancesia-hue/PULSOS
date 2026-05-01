/**
 * Pulso Connect — capa de interoperabilidad.
 *
 * Esta capa NO se implementa en el MVP. Solo deja las firmas y el contrato
 * para que Codex desarrolle conectores reales por categoría.
 *
 * Categorías previstas:
 *   - hl7: HL7v2 + FHIR R4 (hospitales y HCE institucionales)
 *   - obras-sociales: API REST específicas (OSDE, Swiss Medical, etc.)
 *   - farmacias: validación de recetas + control de stock
 *   - laboratorios: ingesta de resultados con HL7-LIS o REST
 */

export interface ConnectAdapter {
  readonly id: string;
  readonly category: 'hl7' | 'obras-sociales' | 'farmacias' | 'laboratorios';
  health(): Promise<{ ok: boolean; latencyMs: number }>;
}

export const stubAdapter = (id: string, category: ConnectAdapter['category']): ConnectAdapter => ({
  id,
  category,
  async health() {
    return { ok: true, latencyMs: 0 };
  },
});
