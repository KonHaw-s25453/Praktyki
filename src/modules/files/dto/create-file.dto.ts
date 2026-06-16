import { IsString, IsNotEmpty, IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  originalName: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsInt()
  @IsPositive()
  size: number;

  @IsString()
  @IsOptional()
  checksum?: string;

  @IsInt()
  @IsOptional()
  @IsPositive()
  duration?: number;
}
