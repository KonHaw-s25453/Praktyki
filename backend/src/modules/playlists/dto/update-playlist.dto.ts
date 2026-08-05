import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PlaylistRepeatMode } from './create-playlist.dto';


class UpdatePlaylistItemDto {

  @ApiProperty()
  @IsNumber()
  id: number;


  @ApiProperty()
  @IsNumber()
  position: number;


  @ApiProperty()
  @IsNumber()
  duration: number;


  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  videoLoops?: number;
}


export class UpdatePlaylistDto {

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;


  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;


  @ApiProperty({
    enum: PlaylistRepeatMode,
    required: false,
  })
  @IsEnum(PlaylistRepeatMode)
  @IsOptional()
  repeatMode?: PlaylistRepeatMode;


  @ApiProperty({
    type: [UpdatePlaylistItemDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePlaylistItemDto)
  @IsOptional()
  items?: UpdatePlaylistItemDto[];
}