import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  filename?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  originalName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  path?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  mimeType?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @IsPositive()
  size?: number;

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
