import { IsInt, IsNotEmpty, IsPositive, IsOptional, IsBoolean } from 'class-validator';

export class UpdateScreenStateDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  currentPlaylistId: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  currentIndex: number;

  @IsBoolean()
  visible: boolean;
}
