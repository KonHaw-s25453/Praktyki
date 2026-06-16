import { IsInt, IsArray, IsNotEmpty } from 'class-validator';

export class ReorderPlaylistItemsDto {
  @IsArray()
  @IsNotEmpty()
  itemIds: number[];
}
