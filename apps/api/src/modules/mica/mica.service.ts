import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { invokeMica, MicaMeta } from '@pulso/ai';
import type { MicaMessage } from '@pulso/types';
import { AuditService } from '../../common/audit/audit.service';

@Injectable()
export class MicaService {
  constructor(private readonly audit: AuditService) {}

  async chat(input: { conversation: MicaMessage[]; citizenContext?: string }) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new ServiceUnavailableException(
        'Pulso Mica no está configurada. Falta ANTHROPIC_API_KEY.',
      );
    }
    const response = await invokeMica(input);

    if (response.prescriptionFlagged) {
      await this.audit.append({
        actorId: null,
        actorRole: null,
        action: 'MICA_PRESCRIPTION_BLOCKED',
        targetType: 'MicaConversation',
        targetId: null,
        outcome: 'BLOCKED',
        payload: { triage: response.triage },
      });
    }
    return {
      ...response,
      promptVersion: MicaMeta.promptVersion,
    };
  }
}
