import Anthropic from '@anthropic-ai/sdk';
import type { MicaMessage, MicaResponse, MicaTriage } from '@pulso/types';
import { MICA_PROMPT_VERSION, MICA_SYSTEM_PROMPT } from './mica-prompt';
import { detectPrescriptionPatterns } from './guardrails';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY no está configurada.');
  }
  client = new Anthropic({ apiKey });
  return client;
}

export interface MicaInvokeOptions {
  conversation: MicaMessage[];
  citizenContext?: string;
  model?: string;
}

export async function invokeMica(opts: MicaInvokeOptions): Promise<MicaResponse> {
  const model = opts.model ?? process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6';

  const systemBlocks: Anthropic.TextBlockParam[] = [
    {
      type: 'text',
      text: MICA_SYSTEM_PROMPT,
      cache_control: { type: 'ephemeral' },
    },
  ];
  if (opts.citizenContext) {
    systemBlocks.push({
      type: 'text',
      text: `# Contexto del ciudadano (autorizado)\n${opts.citizenContext}`,
      cache_control: { type: 'ephemeral' },
    });
  }

  const messages: Anthropic.MessageParam[] = opts.conversation
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role, content: m.content }));

  const response = await getClient().messages.create({
    model,
    system: systemBlocks,
    messages,
    max_tokens: 1024,
    metadata: { user_id: 'mica' },
  });

  const text = response.content
    .filter((c): c is Anthropic.TextBlock => c.type === 'text')
    .map((c) => c.text)
    .join('\n');

  const triage = inferTriage(text);
  const prescriptionFlagged = detectPrescriptionPatterns(text);

  return {
    texto: text,
    triage,
    derivacionSugerida: extractDerivacion(text),
    recordatoriosCreados: [],
    prescriptionFlagged,
  };
}

function inferTriage(text: string): MicaTriage {
  const lower = text.toLowerCase();
  if (/(guardia|107|same|inmediata|urgente ya)/.test(lower)) return 'GUARDIA_INMEDIATA';
  if (/(24[- ]?48 horas|prioritari[oa]|pronto)/.test(lower)) return 'CONSULTA_PRIORITARIA';
  if (/(médico de cabecera|próximos días|consulta|control)/.test(lower))
    return 'CONSULTA_NO_URGENTE';
  return 'INFORMATIVO';
}

function extractDerivacion(text: string): string | null {
  const match = text.match(/te recomiendo (?:ver|consultar) (?:a |un |una )?([^.,\n]+)/i);
  return match?.[1]?.trim() ?? null;
}

export const MicaMeta = { promptVersion: MICA_PROMPT_VERSION };
