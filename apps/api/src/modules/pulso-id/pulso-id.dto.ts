import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MinLength(1) @MaxLength(120)
  nombre?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MinLength(1) @MaxLength(120)
  apellido?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(120)
  localidad?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString()
  telefono?: string;
}

export class AlergiaItem {
  @IsString() @MinLength(2) @MaxLength(200) sustancia!: string;
  @IsEnum(['LEVE', 'MODERADA', 'SEVERA', 'ANAFILACTICA']) severidad!: string;
  @IsOptional() @IsString() @MaxLength(500) notas?: string;
}
export class UpdateAlergiasDto {
  @ApiProperty({ type: [AlergiaItem] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => AlergiaItem)
  alergias!: AlergiaItem[];
}

export class MedicacionItem {
  @IsString() @MinLength(2) @MaxLength(200) nombre!: string;
  @IsOptional() @IsString() @MaxLength(100) presentacion?: string;
  @IsOptional() @IsString() @MaxLength(200) posologia?: string;
  @IsOptional() @IsString() @MaxLength(200) motivo?: string;
}
export class UpdateMedicacionDto {
  @ApiProperty({ type: [MedicacionItem] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => MedicacionItem)
  medicacion!: MedicacionItem[];
}

export class CondicionItem {
  @IsOptional() @IsString() @MaxLength(20) codigo?: string;
  @IsString() @MinLength(2) @MaxLength(200) nombre!: string;
  @IsOptional() @IsString() @MaxLength(500) notas?: string;
}
export class UpdateCondicionesDto {
  @ApiProperty({ type: [CondicionItem] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => CondicionItem)
  condiciones!: CondicionItem[];
}

export class UpdateContactoDto {
  @IsString() @MinLength(2) @MaxLength(120) nombre!: string;
  @IsString() telefono!: string;
  @IsEnum(['PADRE', 'MADRE', 'HIJO', 'CONYUGE', 'HERMANO', 'AMIGO', 'OTRO']) relacion!: string;
}

export class UpdateCoberturaDto {
  @IsEnum(['OBRA_SOCIAL', 'PREPAGA', 'PUBLICA', 'NINGUNA']) tipo!: string;
  @IsOptional() @IsString() @MaxLength(200) obraSocial?: string;
  @IsOptional() @IsString() @MaxLength(60) numeroAfiliado?: string;
  @IsOptional() @IsString() @MaxLength(200) prepaga?: string;
  @IsOptional() @IsString() @MaxLength(100) plan?: string;
}
