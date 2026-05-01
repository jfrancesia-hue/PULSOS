import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'persona@pulso.demo' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Pulso2026Fuerte!', minLength: 12 })
  @IsString()
  @MinLength(12)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/, {
    message: 'La contraseña debe tener al menos 12 caracteres, una minúscula, una mayúscula y un dígito.',
  })
  password!: string;

  @ApiProperty({ example: 'Ana' }) @IsString() @MinLength(1) @MaxLength(120)
  nombre!: string;

  @ApiProperty({ example: 'Martini' }) @IsString() @MinLength(1) @MaxLength(120)
  apellido!: string;

  @ApiProperty({ example: '32145678' })
  @IsString()
  @Matches(/^\d{7,9}$/, { message: 'DNI inválido. Solo números, sin puntos ni guiones.' })
  dni!: string;

  @ApiProperty({ example: '1985-04-12' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Fecha de nacimiento debe ser YYYY-MM-DD.' })
  fechaNacimiento!: string;

  @ApiProperty({ enum: ['MASCULINO', 'FEMENINO', 'INTERSEXUAL'] })
  @IsEnum(['MASCULINO', 'FEMENINO', 'INTERSEXUAL'])
  sexoBiologico!: string;

  @ApiProperty({ example: 'CABA' })
  @IsString()
  provincia!: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(120) localidad?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() telefono?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'admin@pulso.demo' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Pulso2026!' })
  @IsString()
  password!: string;

  @ApiPropertyOptional({ description: 'Código MFA de 6 dígitos si la cuenta tiene MFA habilitado' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/)
  mfaToken?: string;
}

export class RefreshDto {
  @ApiProperty()
  @IsString()
  refreshToken!: string;
}

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  token!: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token!: string;

  @ApiProperty({ minLength: 12 })
  @IsString()
  @MinLength(12)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/)
  newPassword!: string;
}

export class ChangePasswordDto {
  @ApiProperty() @IsString() currentPassword!: string;

  @ApiProperty({ minLength: 12 })
  @IsString()
  @MinLength(12)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/)
  newPassword!: string;
}

export class MfaVerifyDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @Matches(/^\d{6}$/)
  token!: string;
}
