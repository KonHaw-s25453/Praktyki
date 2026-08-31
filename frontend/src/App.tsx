import FilesPage from "./pages/FilesPage.tsx";
import PlaylistsPage from "./pages/PlaylistPage.tsx";
import PlaylistEditPage from "./pages/PlaylistEditPage";
import ScreensPage from "./pages/ScreensPage";
import ScreenEditPage from "./pages/ScreenEditPage";
import LogsPage from "./pages/LogsPage";
import HomePage from "./pages/HomePage";
import { useState } from "react";

export default function App() {

type Page =
    | "home"
    | "files"
    | "playlists"
    | "playlistEdit"
    | "screens"
    | "screenEdit"
    | "logs";


    const [page, setPage] = useState<Page>("home");
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
    const [selectedScreenId, setSelectedScreenId] = useState<number | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    const navigate = (targetPage: Page) => {
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
};

    return (
        <>
            <header className="app-header">
    <div className="app-header-inner">
        <button
            className="app-title"
            onClick={() => navigate("home")}
        >
            Digital Signage CMS
        </button>

        <nav className="main-nav">
            <button onClick={() => navigate("home")}>
                Start
            </button>

            <button onClick={() => navigate("files")}>
                Pliki
            </button>

            <button onClick={() => navigate("playlists")}>
                Playlisty
            </button>

            <button onClick={() => navigate("screens")}>
                Ekrany
            </button>

            <button onClick={() => navigate("logs")}>
                Logi
            </button>
        </nav>
    </div>
</header>

        {page === "home" && (
            <HomePage onNavigate={navigate} />
        )}

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