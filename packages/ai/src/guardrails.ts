/**
 * Guardrails post-hoc para respuestas de Mica.
 * Si alguno de estos patrones aparece, marcamos prescriptionFlagged=true.
 *
 * No bloqueamos la respuesta automáticamente — la flag dispara:
 *   1) audit log MICA_PRESCRIPTION_BLOCKED
 *   2) revisión manual por el equipo Pulso
 *   3) reentrenamiento del prompt si se vuelve recurrente
 */

const PRESCRIPTION_PATTERNS: RegExp[] = [
  /\b\d+\s?(mg|mcg|gr|ml|ui|unidades)\b/i,
  /\btomá\s+\d+/i,
  /\btomar\s+\d+/i,
  /\bdosis\s+de\s+\d+/i,
  /\bcada\s+\d+\s+(horas?|hs)\b/i,
  /\b(amoxicilina|ibuprofeno|paracetamol|omeprazol|atorvastatina|metformina|enalapril|losartán|salbutamol|amoxidal|tafirol|actron)\b.*\b(comprimid|cápsul|jarabe|gota|aerosol|inyección)/i,
];

export function detectPrescriptionPatterns(text: string): boolean {
  return PRESCRIPTION_PATTERNS.some((rx) => rx.test(text));
}
