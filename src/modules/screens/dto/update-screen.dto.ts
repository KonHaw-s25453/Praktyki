import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';

export class UpdateScreenDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @IsOptional()
  @IsPositive()
  fallbackFileId?: number;
}

