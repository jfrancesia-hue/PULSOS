import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'persona@pulso.demo' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Pulso2026!' })
  @IsString()
  @MinLength(12)
  password!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'admin@pulso.demo' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Pulso2026!' })
  @IsString()
  password!: string;
}
