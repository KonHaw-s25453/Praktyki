import type { PlaylistDto } from "../types/PlaylistDto";

interface PlaylistListProps {
    playlists: PlaylistDto[];
    onDelete: (id: number) => void;
}

export default function PlaylistList({
    playlists,
    onDelete,
}: PlaylistListProps) {
    return (
        <ul>
            {playlists.map((playlist) => (
                <li key={playlist.id}>
                    {playlist.name}

                    <button onClick={() => onDelete(playlist.id)}>
                        Usuń
                    </button>
                </li>
            ))}
        </ul>
    );
}