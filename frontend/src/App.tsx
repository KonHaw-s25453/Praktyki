import FilesPage from "./pages/FilesPage.tsx";
import PlaylistsPage from "./pages/PlaylistPage.tsx";
import PlaylistEditPage from "./pages/PlaylistEditPage";
import ScreensPage from "./pages/ScreensPage";
import ScreenEditPage from "./pages/ScreenEditPage";
import LogsPage from "./pages/LogsPage";
import { useState } from "react";

export default function App() {

    const [page, setPage] = useState<"files" | "playlists" | "playlistEdit"| "screens" |
    "screenEdit"|"logs">("files");
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
    const [selectedScreenId, setSelectedScreenId] = useState<number | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    const navigate = (targetPage: "files" | "playlists" | "playlistEdit" | "screens" |
    "screenEdit"|"logs") => {
        if (isDirty) {
            const confirmLeave = window.confirm(
                "Masz niezapisane zmiany. Czy na pewno chcesz opuścić stronę?"
            );
            if (!confirmLeave) {
                return;
            }
        }
        setPage(targetPage);
        setIsDirty(false);
    }

    return (
        <>
            <nav>
                <button onClick={() => navigate("files")}>
                    Pliki
                </button>

                <button onClick={() => navigate("playlists")}>
                    Playlisty
                </button>

                <button onClick={() => navigate("playlistEdit")}>
                    Edycja playlisty
                </button>

                <button onClick={() => navigate("screens")}>
                    Ekrany
                </button>

                <button onClick={() => navigate("logs")}>
                    Logi
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
            onBack={() => navigate("playlists")}
            onDirtyChange={setIsDirty}
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
                onBack={() => navigate("screens")}
                onDirtyChange={setIsDirty}
            />
        )}

        {page === "logs" && (
        <LogsPage />
)}
    </>
);
}