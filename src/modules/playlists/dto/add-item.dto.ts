import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddItemToPlaylistDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  fileId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  position: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  duration: number;
}
