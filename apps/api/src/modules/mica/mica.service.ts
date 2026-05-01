import { Injectable, Logger } from '@nestjs/common';
import { invokeMica, MicaMeta } from '@pulso/ai';
import type { MicaMessage, MicaResponse } from '@pulso/types';
import { AuditService } from '../../common/audit/audit.service';
import { PrismaService } from '../../common/prisma/prisma.service';

interface ChatInput {
  conversation: MicaMessage[];
  citizenContext?: string;
  userId?: string;
}

@Injectable()
export class MicaService {
  private readonly logger = new Logger('Mica');
  constructor(
    private readonly audit: AuditService,
    private readonly prisma: PrismaService,
  ) {}

  async chat(input: ChatInput): Promise<MicaResponse & { promptVersion: string; mode: 'live' | 'mock' }> {
    const hasKey = Boolean(process.env.ANTHROPIC_API_KEY);

    let response: MicaResponse;
    let mode: 'live' | 'mock';

    if (hasKey) {
      try {
        response = await invokeMica({
          conversation: input.conversation,
          citizenContext: input.citizenContext,
        });
        mode = 'live';
      } catch (err) {
        this.logger.warn(`Anthropic falló, usando mock: ${(err as Error).message}`);
        response = this.mockResponse(input);
        mode = 'mock';
      }
    } else {
      response = this.mockResponse(input);
      mode = 'mock';
    }

    if (response.prescriptionFlagged) {
      await this.audit.append({
        actorId: input.userId ?? null,
        actorRole: input.userId ? 'CIUDADANO' : null,
        action: 'MICA_PRESCRIPTION_BLOCKED',
        targetType: 'MicaConversation',
        targetId: null,
        outcome: 'BLOCKED',
        payload: { triage: response.triage, mode },
      });
    }

    if (input.userId) {
      const last = await this.prisma.client.micaConversation.findFirst({
        where: { userId: input.userId, endedAt: null },
        orderBy: { startedAt: 'desc' },
      });
      const conv = last
        ? await this.prisma.client.micaConversation.update({
            where: { id: last.id },
            data: {
              messageCount: { increment: 2 },
              lastTriage: response.triage,
              prescriptionFlagged: response.prescriptionFlagged || last.prescriptionFlagged,
              derivacion: response.derivacionSugerida ?? last.derivacion,
            },
          })
        : await this.prisma.client.micaConversation.create({
            data: {
              userId: input.userId,
              messageCount: 2,
              lastTriage: response.triage,
              prescriptionFlagged: response.prescriptionFlagged,
              derivacion: response.derivacionSugerida,
            },
          });

      if (last === null) {
        await this.audit.append({
          actorId: input.userId,
          actorRole: 'CIUDADANO',
          action: 'MICA_CONVERSATION_STARTED',
          targetType: 'MicaConversation',
          targetId: conv.id,
          outcome: 'SUCCESS',
          payload: { mode },
        });
      }
    }

    return { ...response, promptVersion: MicaMeta.promptVersion, mode };
  }

  /**
   * Mock seguro: triage por palabras clave + cierre obligatorio. Nunca prescribe.
   */
  private mockResponse(input: ChatInput): MicaResponse {
    const lastUser = [...input.conversation]
      .reverse()
      .find((m) => m.role === 'user')?.content.toLowerCase() ?? '';

    const URGENT_PATTERNS = [
      /(dolor.*pecho|infarto)/,
      /(no\s+puedo\s+respirar|me ahogo|disnea)/,
      /(perd[íi]\s+el\s+conocimiento|inconscien)/,
      /(sangra(do|ndo)\s+(mucho|abundant))/,
      /(convuls)/,
      /(cara\s+(torcida|chueca)|no\s+puedo\s+hablar)/,
    ];
    const PRIORITY_PATTERNS = [/(fiebre.*40|fiebre alta)/, /(vomito.*sangre)/, /(dolor.*intenso)/];

    let triage: MicaResponse['triage'] = 'INFORMATIVO';
    let texto: string;
    let derivacion: string | null = null;

    if (URGENT_PATTERNS.some((rx) => rx.test(lastUser))) {
      triage = 'GUARDIA_INMEDIATA';
      derivacion = 'Guardia médica más cercana o llamar al 107 (SAME)';
      texto =
        'Lo que describís puede ser una emergencia. Te pido que vayas a la guardia médica más cercana ahora o llames al 107 (SAME) sin demora. No esperes a ver si mejora.\n\nRecordá: Mica no reemplaza a un profesional médico. Para diagnóstico y tratamiento, consultá siempre con tu médico/a.';
    } else if (PRIORITY_PATTERNS.some((rx) => rx.test(lastUser))) {
      triage = 'CONSULTA_PRIORITARIA';
      derivacion = 'Profesional clínico en las próximas 24-48 horas';
      texto =
        'Lo que contás puede necesitar atención pronto. Te recomiendo consultar a un profesional clínico en las próximas 24 a 48 horas. Si los síntomas empeoran o se suman dolor de pecho, dificultad para respirar o pérdida de conciencia, andá directo a la guardia.\n\nRecordá: Mica no reemplaza a un profesional médico. Para diagnóstico y tratamiento, consultá siempre con tu médico/a.';
    } else if (/(estudio|análisis|laboratorio|hba1c|colesterol|glucemia)/.test(lastUser)) {
      triage = 'CONSULTA_NO_URGENTE';
      derivacion = 'Médico de cabecera';
      texto =
        'Te puedo ayudar a entender tu estudio en términos generales. Sin embargo, la interpretación clínica completa la tiene que hacer tu médico/a, que conoce tu historia. Lo ideal es llevar el estudio a tu próximo control con tu médico de cabecera. Si querés, puedo recordarte agendar el turno.\n\nRecordá: Mica no reemplaza a un profesional médico. Para diagnóstico y tratamiento, consultá siempre con tu médico/a.';
    } else if (/(medicación|recordatorio|me olvid|tomar)/.test(lastUser)) {
      triage = 'INFORMATIVO';
      texto =
        'Puedo ayudarte a organizar tus recordatorios de medicación dentro de Pulso. Decime el nombre del medicamento y los horarios y los dejo programados. Si te olvidaste una dosis o tenés dudas sobre cómo recuperarla, lo más seguro es preguntarle a tu médico/a o farmacéutico/a.\n\nRecordá: Mica no reemplaza a un profesional médico. Para diagnóstico y tratamiento, consultá siempre con tu médico/a.';
    } else {
      texto =
        '¡Hola! Soy Mica, tu acompañante sanitaria de Pulso. Puedo ayudarte a entender tus estudios, organizar recordatorios de medicación, responder dudas generales de salud y derivarte cuando algo necesite la mirada de un profesional. ¿En qué te puedo ayudar?\n\nRecordá: Mica no reemplaza a un profesional médico. Para diagnóstico y tratamiento, consultá siempre con tu médico/a.';
    }

    return {
      texto,
      triage,
      derivacionSugerida: derivacion,
      recordatoriosCreados: [],
      prescriptionFlagged: false,
    };
  }
}
