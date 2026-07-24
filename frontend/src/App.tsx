import FilesPage from "./pages/FilesPage.tsx";
import PlaylistsPage from "./pages/PlaylistPage.tsx";
import PlaylistEditPage from "./pages/PlaylistEditPage";
import ScreensPage from "./pages/ScreensPage";
import ScreenEditPage from "./pages/ScreenEditPage";
import { useState } from "react";

export default function App() {

    const [page, setPage] = useState<"files" | "playlists" | "playlistEdit"| "screens" |
    "screenEdit">("files");
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
    const [selectedScreenId, setSelectedScreenId] = useState<number | null>(null);
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
                 <button onClick={() => setPage("screens")}>
                    Ekrany
                </button>
                <button onClick={() => setPage("screenEdit")}>
                Edycja ekranu
                </button>
</nav>


      {page === "files" && (
            <FilesPage />
        )}


        {page === "playlists" && (
            <PlaylistsPage
                onEdit={(id) => {
                    setSelectedPlaylistId(id);
                    setPage("playlistEdit");
                }}
            />
        )}


        {page === "playlistEdit" && (
            <PlaylistEditPage
                playlistId={selectedPlaylistId}
            />
        )}


        {page === "screens" && (
            <ScreensPage
                onEdit={(id) => {
                    setSelectedScreenId(id);
                    setPage("screenEdit");
                }}
            />
        )}


        {page === "screenEdit" && (
            <ScreenEditPage
                screenId={selectedScreenId}
            />
        )}
    </>
);
}