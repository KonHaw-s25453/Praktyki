export interface PlaylistFileDto {
    id: number;
    originalName: string;
    mimeType: string;
}

export interface PlaylistItemDto {
    id: number;
    position: number;
    duration: number;
    videoLoops: number;
    file: PlaylistFileDto;
}

export interface PlaylistDto {
    id: number;
    name: string;
    description: string;
    revision: number;
    createdAt: string;
    updatedAt: string;
    repeatMode?: string;
    items: PlaylistItemDto[];
}