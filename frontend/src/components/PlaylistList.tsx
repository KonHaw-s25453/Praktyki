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
        <ul className="playlist-list">
            {playlists.map((playlist) => (
                <li
                    key={playlist.id}
                    className="playlist-card"
                >
                    <div className="playlist-card-content">
                        <h2 className="playlist-card-title">
                            {playlist.name}
                        </h2>

                        {playlist.description && (
                            <p className="playlist-card-description">
                                {playlist.description}
                            </p>
                        )}

                        <div className="playlist-files">
                            {playlist.items.length === 0 ? (
                                <p className="playlist-empty">
                                    Brak plików
                                </p>
                            ) : (
                                playlist.items
                                    .sort(
                                        (a, b) =>
                                            a.position - b.position
                                    )
                                    .map((item) => (
                                        <div
                                            key={item.id}
                                            className="playlist-file"
                                        >
                                            <span className="playlist-file-icon">
                                                {item.file.mimeType.startsWith(
                                                    "video/"
                                                )
                                                    ? "🎬"
                                                    : item.file.mimeType.startsWith(
                                                        "image/"
                                                    )
                                                        ? "🖼️"
                                                        : "📄"}
                                            </span>

                                            <span className="playlist-file-name">
                                                {item.file.originalName}
                                            </span>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>

                    <div className="playlist-card-actions">
                        <button
                            className="playlist-edit"
                            onClick={() => onEdit(playlist.id)}
                        >
                            Edytuj
                        </button>

                        <button
                            className="playlist-delete"
                            onClick={() => onDelete(playlist.id)}
                        >
                            Usuń
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}