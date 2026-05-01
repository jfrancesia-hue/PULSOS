import { registerDecorator, ValidationOptions } from 'class-validator';
import { isValidCuil } from '@pulso/types';

export function IsCuilAr(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCuilAr',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;
          return isValidCuil(value);
        },
        defaultMessage() {
          return 'CUIL/CUIT inválido. Verificá el dígito verificador.';
        },
      },
    });
  };
}
