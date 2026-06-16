import { IsString, IsNotEmpty, IsOptional, IsInt, IsPositive } from 'class-validator';

export class CreateScreenDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @IsOptional()
  @IsPositive()
  fallbackFileId?: number;
}
