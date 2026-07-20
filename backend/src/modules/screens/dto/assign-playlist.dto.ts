import {
  IsString,
  IsOptional,
  IsInt,
  IsPositive,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignPlaylistDto {
  @ApiProperty({
    example: 1,
    description: 'ID playlisty przypisywanej do ekranu',
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  playlistId: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Priorytet przypisania',
  })
  @IsInt()
  @IsOptional()
  @IsPositive()
  priority?: number;

  @ApiPropertyOptional({
    example: '2026-07-20T12:00:00Z',
    description: 'Data rozpoczęcia aktywności playlisty',
  })
  @IsDateString()
  @IsOptional()
  activeFrom?: string;

  @ApiPropertyOptional({
    example: '2026-08-20T12:00:00Z',
    description: 'Data zakończenia aktywności playlisty',
  })
  @IsDateString()
  @IsOptional()
  activeTo?: string;
}
