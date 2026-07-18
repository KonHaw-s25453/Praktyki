import FilesPage from "./pages/FilesPage.tsx";
import PlaylistsPage from "./pages/PlaylistPage.tsx";
import { useState } from "react";

export default function App() {

    const [page, setPage] = useState<"files" | "playlists">("files");


    return (
        <>
            <nav>
                <button onClick={() => setPage("files")}>
                    Pliki
                </button>

                <button onClick={() => setPage("playlists")}>
                    Playlisty
                </button>
            </nav>


            {page === "files" && <FilesPage />}

            {page === "playlists" && <PlaylistsPage />}
        </>
    );
}