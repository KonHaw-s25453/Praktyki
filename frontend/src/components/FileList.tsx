import type { FileDto } from "../types/FileDto";

interface FileListProps {
    files: FileDto[];
    onDelete: (id: number) => void;
}

export default function FileList({ files, onDelete }: FileListProps) {
    return (
        <ul>
            {files.map(file => (
                <li key={file.id}>
                    {file.originalName}

                    <button onClick={() => onDelete(file.id)}>
                        Usuń
                    </button>
                </li>
            ))}
        </ul>
    );
}