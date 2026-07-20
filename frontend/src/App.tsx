import FilesPage from "./pages/FilesPage.tsx";
import PlaylistsPage from "./pages/PlaylistPage.tsx";
import PlaylistEditPage from "./pages/PlaylistEditPage";
import { useState } from "react";

export default function App() {

    const [page, setPage] = useState<"files" | "playlists" | "playlistEdit">("files");
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);

    return (
        <>
            <nav>
                <button onClick={() => setPage("files")}>
                    Pliki
                </button>

                <button onClick={() => setPage("playlists")}>
                    Playlisty
                </button>
                <button onClick={() => setPage("playlistEdit")}>
                    Edycja playlisty
                </button>
            </nav>


      {page === "files" && <FilesPage />}

{page === "playlists" && (
    <PlaylistsPage
        onEdit={(id) => {
            setSelectedPlaylistId(id);
            setPage("playlistEdit");
        }}
    />
)}

{page === "playlistEdit" && (
    <PlaylistEditPage playlistId={selectedPlaylistId} />
)}
        </>
    );
}