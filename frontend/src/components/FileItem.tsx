import type { FileDto } from "../types/FileDto";

interface Props {
    file: FileDto;
    onDelete: (id: number) => void;
}

export default function FileItem({ file, onDelete }: Props) {
    return (
        <li>
            {file.exists ? (
                file.originalName
            ) : (
                <>
                    {file.originalName} — <strong>Plik nie znaleziony</strong>
                </>
            )}

            <button onClick={() => onDelete(file.id)}>
                Usuń
            </button>
        </li>
    );
}