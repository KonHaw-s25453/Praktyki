import { ApiProperty } from '@nestjs/swagger';

export class ResponseFileDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    filename: string;

    @ApiProperty()
    originalName: string;

    @ApiProperty()
    path: string;

    @ApiProperty()
    mimeType: string;

    @ApiProperty({ nullable: true })
    duration: number | null;

    @ApiProperty()
    size: number;

    @ApiProperty({ nullable: true })
    checksum: string | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    exists: boolean;
}