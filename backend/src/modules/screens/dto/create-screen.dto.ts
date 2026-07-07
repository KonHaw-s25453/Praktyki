import { IsString, IsNotEmpty, IsOptional, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScreenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @IsPositive()
  fallbackFileId?: number;
}
