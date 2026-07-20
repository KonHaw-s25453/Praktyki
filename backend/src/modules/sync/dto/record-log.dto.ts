import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum LogLevel {
  INFO = 'INFO',
  ERROR = 'ERROR',
  PLAYBACK = 'PLAYBACK',
}

export class RecordLogDto {

  @ApiProperty({
    example: 'Playback started',
    description: 'Treść komunikatu logu',
  })
  @IsString()
  @IsNotEmpty()
  message: string;


  @ApiPropertyOptional({
    enum: LogLevel,
    example: LogLevel.INFO,
    description: 'Poziom logu',
  })
  @IsOptional()
  level?: LogLevel;
}