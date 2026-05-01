export class AuthError extends Error {
  readonly code: string;
  readonly statusCode: number;
  constructor(code: string, message: string, statusCode = 401) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class UnauthorizedAccessError extends AuthError {
  constructor(message = 'No autenticado') {
    super('UNAUTHORIZED', message, 401);
  }
}

export class InvalidTokenError extends AuthError {
  constructor(message = 'Token inválido o expirado') {
    super('INVALID_TOKEN', message, 401);
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = 'Acceso prohibido') {
    super('FORBIDDEN', message, 403);
  }
}

export class MfaRequiredError extends AuthError {
  constructor(message = 'Se requiere segundo factor (MFA)') {
    super('MFA_REQUIRED', message, 401);
  }
}

export class ConsentRequiredError extends AuthError {
  constructor(message = 'Se requiere consentimiento del ciudadano') {
    super('CONSENT_REQUIRED', message, 403);
  }
}
