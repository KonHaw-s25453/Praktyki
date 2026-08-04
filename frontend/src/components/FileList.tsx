import type { FileDto } from "../types/FileDto";

interface FileListProps {
    files: FileDto[];
    onDelete: (id: number) => void;
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
                            🎬
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