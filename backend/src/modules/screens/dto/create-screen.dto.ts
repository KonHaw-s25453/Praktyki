import { IsString, IsNotEmpty, IsOptional, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScreenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
  })
  
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'ID obrazu lub filmu używanego jako ekran awaryjny',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  fallbackFileId: number;

  @ApiProperty({
    required: false,
    example: 'http://localhost:5174',
    description: 'Adres aplikacji Player dla tego ekranu',
  })
  @IsString()
  @IsOptional()
  playerUrl?: string;
  }