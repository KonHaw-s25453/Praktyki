import { IsInt, IsPositive, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemToPlaylistDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  fileId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  position: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    default: 1,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  videoLoops?: number;
}