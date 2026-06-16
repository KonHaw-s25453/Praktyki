import {
  IsString,
  IsOptional,
  IsInt,
  IsPositive,
  IsDateString,
} from 'class-validator';

export class AssignPlaylistDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  playlistId: number;

  @IsInt()
  @IsOptional()
  @IsPositive()
  priority?: number;

  @IsDateString()
  @IsOptional()
  activeFrom?: string;

  @IsDateString()
  @IsOptional()
  activeTo?: string;
}
