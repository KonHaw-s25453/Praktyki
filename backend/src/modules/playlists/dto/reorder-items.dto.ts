import { IsArray, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 
import { Type } from 'class-transformer';

export class ReorderPlaylistItemsDto {

  @ApiProperty({
    type: [Number],
    example: [5, 2, 7],
  })
  @IsArray()
  @IsNotEmpty()
  @IsInt({ each: true })
  itemIds: number[];
}