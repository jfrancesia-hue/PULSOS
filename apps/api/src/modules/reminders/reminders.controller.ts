import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsBoolean, IsEnum, IsOptional, IsString, MaxLength, Matches, MinLength } from 'class-validator';
import { RemindersService } from './reminders.service';
import { CurrentUser, type AuthContext } from '../../common/auth';

class ReminderHourDto {}

class CreateReminderDto {
  @IsString() @MinLength(2) @MaxLength(200) medicacion!: string;
  @IsOptional() @IsString() @MaxLength(100) presentacion?: string;
  @IsOptional() @IsString() @MaxLength(200) posologia?: string;
  @IsEnum(['DAILY', 'TWICE_DAILY', 'THREE_TIMES_DAILY', 'EVERY_8H', 'EVERY_12H', 'WEEKLY', 'CUSTOM'])
  frequency!: string;
  @IsArray() @ArrayMaxSize(8) @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { each: true })
  hours!: string[];
  @IsString() @Matches(/^\d{4}-\d{2}-\d{2}$/) startDate!: string;
  @IsOptional() @IsString() @Matches(/^\d{4}-\d{2}-\d{2}$/) endDate?: string;
}

class UpdateReminderDto {
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @IsArray() @ArrayMaxSize(8) @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { each: true })
  hours?: string[];
  @IsOptional() @IsString() @Matches(/^\d{4}-\d{2}-\d{2}$/) endDate?: string;
}

@ApiBearerAuth()
@ApiTags('reminders')
@Controller('reminders')
export class RemindersController {
  constructor(private readonly service: RemindersService) {}

  @Get('me')
  list(@CurrentUser() user: AuthContext) {
    return this.service.list(user.userId);
  }

  @Post('me')
  create(@CurrentUser() user: AuthContext, @Body() dto: CreateReminderDto) {
    return this.service.create(user.userId, dto);
  }

  @Patch('me/:id')
  update(@CurrentUser() user: AuthContext, @Param('id') id: string, @Body() dto: UpdateReminderDto) {
    return this.service.update(user.userId, id, dto);
  }

  @Delete('me/:id')
  remove(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    return this.service.remove(user.userId, id);
  }
}
