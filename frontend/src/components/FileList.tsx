import type React from "react";
import type { FileDto } from "../types/FileDto";

const API_URL = import.meta.env.VITE_API_URL;

interface FileListProps {
    files: FileDto[];
    onDelete: (id: number) => void;
}

function VideoThumbnail({ file }: { file: FileDto }) {
    const handleMouseEnter = (
        event: React.MouseEvent<HTMLVideoElement>
    ) => {
        const video = event.currentTarget;

        video.currentTime = 0;
        video.play();
    };

    const handleMouseLeave = (
        event: React.MouseEvent<HTMLVideoElement>
    ) => {
        const video = event.currentTarget;

        video.pause();
        video.currentTime = 0;
    };

    const handleTimeUpdate = (
        event: React.SyntheticEvent<HTMLVideoElement>
    ) => {
        const video = event.currentTarget;

        if (video.currentTime >= 10) {
            video.pause();
            video.currentTime = 0;
        }
    };

    return (
        <video
            className="file-thumbnail"
            src={`${API_URL}/files/${file.id}/content`}
            preload="metadata"
            muted
            onLoadedMetadata={(event) => {
                event.currentTarget.currentTime = 0;
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTimeUpdate={handleTimeUpdate}
        />
    );
}

export default function FileList({
    files,
    onDelete
}: FileListProps) {
    return (
        <div className="file-list">
            {files.map(file => (
                <div
                    className="file-card"
                    key={file.id}
                >
                    <div className="file-preview">
                        {file.mimeType.startsWith("image/") ? (
                            <img
                                className="file-thumbnail"
                                src={`${API_URL}/files/${file.id}/content`}
                                alt={file.originalName}
                            />
                        ) : file.mimeType.startsWith("video/") ? (
                            <VideoThumbnail file={file} />
                        ) : (
                            <div className="file-icon">
                                📄
                            </div>
                        )}
                    </div>

                    <div className="file-name">
                        {file.originalName}
                    </div>

                    <button
                        className="file-delete"
                        onClick={() => onDelete(file.id)}
                    >
                        Usuń
                    </button>
                </div>
            ))}
        </div>
    );
}