import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { MicaService } from './mica.service';

class MicaMessageDto {
  @ApiProperty({ example: 'user' })
  @IsString()
  role!: 'user' | 'assistant' | 'system';

  @ApiProperty({ example: '¿Qué significa que mi colesterol total es 215?' })
  @IsString()
  content!: string;
}

class MicaChatDto {
  @ApiProperty({ type: [MicaMessageDto] })
  @IsArray()
  conversation!: MicaMessageDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  citizenContext?: string;
}

@ApiTags('mica')
@Controller('mica')
export class MicaController {
  constructor(private readonly service: MicaService) {}

  @Post('chat')
  chat(@Body() dto: MicaChatDto) {
    return this.service.chat(dto);
  }
}
