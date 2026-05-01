import type { Params } from 'nestjs-pino';

/**
 * Configuración Pino con redacción defensiva de PII médica.
 * Lo crítico: NO loguear contenido de evolución clínica, alergias detalladas,
 * medicación, ni payloads completos de eventos clínicos.
 */
export const loggerConfig: Params = {
  pinoHttp: {
    level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'SYS:HH:MM:ss', singleLine: true },
          }
        : undefined,
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.body.password',
        'req.body.newPassword',
        'req.body.currentPassword',
        'req.body.refreshToken',
        'req.body.token',
        'req.body.mfaToken',
        'req.body.descripcion',
        'req.body.notas',
        'req.body.diagnostico',
        'req.body.alergias',
        'req.body.medicacion',
        'req.body.medicacionHabitual',
        'req.body.condiciones',
        'req.body.condicionesCriticas',
        'req.body.contactoEmergencia',
        'req.body.cobertura',
        '*.passwordHash',
        '*.tokenHash',
        '*.mfaSecret',
      ],
      censor: '[REDACTED]',
    },
    customLogLevel: (_, res, err) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
    customErrorMessage: (req, res, err) =>
      `${req.method} ${req.url} ${res.statusCode} — ${err.message}`,
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        userAgent: req.headers?.['user-agent'],
      }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  },
};
