import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PlaylistRepeatMode {
  LOOP = 'LOOP',
  FALLBACK = 'FALLBACK',
}

export class CreatePlaylistDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    enum: PlaylistRepeatMode,
    default: PlaylistRepeatMode.LOOP,
  })
  @IsEnum(PlaylistRepeatMode)
  @IsOptional()
  repeatMode?: PlaylistRepeatMode;
}