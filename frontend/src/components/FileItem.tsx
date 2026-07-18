import type { FileDto } from "../types/FileDto";

interface Props {
    file: FileDto;
    onDelete: (id:number)=>void;
}

export default function FileItem({file, onDelete}: Props) {
    return (
        <li>
            {file.originalName}

            <button onClick={() => onDelete(file.id)}>
                Usuń
            </button>
        </li>
    );
}