import type React from "react";
import type { FileDto } from "../types/FileDto";

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
            src={`http://localhost:3000/files/${file.id}/content`}
            preload="metadata"
            muted
            onLoadedMetadata={(event) => {
                event.currentTarget.currentTime = 0;
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTimeUpdate={handleTimeUpdate}
            style={{
                width: "160px",
                height: "100px",
                objectFit: "contain",
                cursor: "pointer"
            }}
        />
    );
}


export default function FileList({ files, onDelete }: FileListProps) {
    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px"
            }}
        >
            {files.map(file => (
                <div
                    key={file.id}
                    style={{
                        width: "180px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "10px"
                    }}
                >

                    {file.mimeType.startsWith("image/") ? (
                        <img
                            src={`http://localhost:3000/files/${file.id}/content`}
                            alt={file.originalName}
                            style={{
                                width: "160px",
                                height: "100px",
                                objectFit: "contain"
                            }}
                        />
                    ) : file.mimeType.startsWith("video/") ? (
                        <VideoThumbnail file={file} />
                    ) : (
                        <div
                            style={{
                                width: "160px",
                                height: "100px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "40px"
                            }}
                        >
                            📄
                        </div>
                    )}

                    <div>
                        {file.originalName}
                    </div>

                    <button onClick={() => onDelete(file.id)}>
                        Usuń
                    </button>

                </div>
            ))}
        </div>
    );
}

