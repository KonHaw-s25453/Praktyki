import type { PlaylistDto } from "../types/PlaylistDto";

interface PlaylistListProps {
    playlists: PlaylistDto[];
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
}

export default function PlaylistList({
    playlists,
    onDelete,
    onEdit,
}: PlaylistListProps) {
    return (
        <ul>
            {playlists.map((playlist) => (
                <li key={playlist.id}>
                    {playlist.name}

                    <button onClick={() => onDelete(playlist.id)}>
                        Usuń
                    </button>
                    <button onClick={() => onEdit(playlist.id)}>
                        Edytuj
                    </button>
                </li>
            ))}
        </ul>
    );
}
