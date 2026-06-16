import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class GetManifestQueryDto {
  @IsInt()
  @IsOptional()
  @IsPositive()
  sinceRevision?: number;
}
