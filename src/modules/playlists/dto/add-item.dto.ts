import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';

export class AddItemToPlaylistDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  fileId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  position: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  duration: number;
}
