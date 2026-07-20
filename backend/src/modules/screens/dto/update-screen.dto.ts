import {
  IsString,
  IsOptional,
  IsInt,
  IsPositive,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateScreenDto {

  @ApiPropertyOptional({
    example: 'Ekran hol główny',
    description: 'Nazwa ekranu',
  })
  @IsString()
  @IsOptional()
  name?: string;


  @ApiPropertyOptional({
    example: 'Budynek A, parter',
    description: 'Lokalizacja ekranu',
  })
  @IsString()
  @IsOptional()
  location?: string;


  @ApiPropertyOptional({
    example: 15,
    description: 'ID pliku używanego jako fallback',
  })
  @IsInt()
  @IsOptional()
  @IsPositive()
  fallbackFileId?: number;
}