import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PrescriptionsService } from './prescriptions.service';
import { CurrentUser, Roles, type AuthContext } from '../../common/auth';

class ItemDto {
  @IsString() @MinLength(2) @MaxLength(200) medicacion!: string;
  @IsOptional() @IsString() @MaxLength(100) presentacion?: string;
  @IsString() @MinLength(2) @MaxLength(300) posologia!: string;
  @IsOptional() @IsString() @MaxLength(60) cantidad?: string;
  @IsOptional() duracionDias?: number;
  @IsOptional() @IsString() @MaxLength(500) observaciones?: string;
}

class IssuePrescriptionDto {
  @IsString() ciudadanoDni!: string;
  @IsOptional() @IsString() @MaxLength(300) diagnostico?: string;
  @IsOptional() @IsString() @MaxLength(2000) notas?: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => ItemDto)
  items!: ItemDto[];
  @IsOptional() validezDias?: number;
}

@ApiBearerAuth()
@ApiTags('prescriptions')
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly service: PrescriptionsService) {}

  @Roles('PROFESIONAL')
  @Post()
  issue(@CurrentUser() user: AuthContext, @Body() dto: IssuePrescriptionDto) {
    return this.service.issue(user.userId, dto);
  }

  @Get('me')
  myPrescriptions(@CurrentUser() user: AuthContext) {
    return this.service.listForCitizen(user.userId);
  }

  @Get(':id')
  detail(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    return this.service.get(user, id);
  }

  @Roles('FARMACIA')
  @Post(':id/dispense')
  dispense(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    return this.service.dispense(user.userId, id);
  }
}
