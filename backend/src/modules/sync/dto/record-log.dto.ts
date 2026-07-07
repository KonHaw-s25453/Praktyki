import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class RecordLogDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  level?: 'INFO' | 'ERROR' | 'PLAYBACK';
}
