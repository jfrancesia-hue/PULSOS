import { describe, it, expect } from 'vitest';
import { assertRole, assertOwnerOrRole, isOwner } from '../rbac';
import { ForbiddenError, MfaRequiredError } from '../errors';

describe('rbac', () => {
  it('assertRole pasa con rol superior', () => {
    expect(() =>
      assertRole({ userId: 'u', role: 'ADMIN', mfaSatisfied: true }, 'PROFESIONAL'),
    ).not.toThrow();
  });

  it('assertRole rechaza con rol insuficiente', () => {
    expect(() =>
      assertRole({ userId: 'u', role: 'CIUDADANO', mfaSatisfied: true }, 'ADMIN'),
    ).toThrow(ForbiddenError);
  });

  it('assertRole exige MFA en ADMIN', () => {
    expect(() =>
      assertRole({ userId: 'u', role: 'ADMIN', mfaSatisfied: false }, 'ADMIN'),
    ).toThrow(MfaRequiredError);
  });

  it('isOwner identifica al titular', () => {
    expect(isOwner({ userId: 'u1', role: 'CIUDADANO', mfaSatisfied: false }, 'u1')).toBe(true);
    expect(isOwner({ userId: 'u1', role: 'CIUDADANO', mfaSatisfied: false }, 'u2')).toBe(false);
  });

  it('assertOwnerOrRole permite al owner aunque no tenga rol', () => {
    expect(() =>
      assertOwnerOrRole({ userId: 'u1', role: 'CIUDADANO', mfaSatisfied: false }, 'u1', 'ADMIN'),
    ).not.toThrow();
  });

  it('assertOwnerOrRole rechaza si no es owner ni tiene rol', () => {
    expect(() =>
      assertOwnerOrRole({ userId: 'u1', role: 'CIUDADANO', mfaSatisfied: false }, 'u2', 'ADMIN'),
    ).toThrow(ForbiddenError);
  });
});
