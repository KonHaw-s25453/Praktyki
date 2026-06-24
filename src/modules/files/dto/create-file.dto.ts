import { IsString, IsNotEmpty, IsInt, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateFileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  size: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  checksum?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @IsPositive()
  duration?: number;
}
