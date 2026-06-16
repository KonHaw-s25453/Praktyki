import { IsInt, IsNotEmpty, IsPositive, IsOptional, IsString } from 'class-validator';

export class UpdateScreenStateDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  currentPlaylistId: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  currentIndex: number;
}
