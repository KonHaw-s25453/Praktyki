import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';

export class UpdateFileDto {
  @IsString()
  @IsOptional()
  filename?: string;

  @IsString()
  @IsOptional()
  originalName?: string;

  @IsString()
  @IsOptional()
  path?: string;

  @IsString()
  @IsOptional()
  mimeType?: string;

  @IsInt()
  @IsOptional()
  @IsPositive()
  size?: number;

  @IsString()
  @IsOptional()
  checksum?: string;

  @IsInt()
  @IsOptional()
  @IsPositive()
  duration?: number;
}
