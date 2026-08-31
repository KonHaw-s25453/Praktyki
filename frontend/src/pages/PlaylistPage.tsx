import { useEffect, useState } from "react";

import PlaylistsApi from "../api/src/api/PlaylistsApi";

import PlaylistList from "../components/PlaylistList";

import type { PlaylistEntity } from "../api/src/model/PlaylistEntity";



const playlistApi = new PlaylistsApi();

type PlaylistsPageProps = {
    onEdit: (playlistId: number) => void;
};

export default function PlaylistsPage({ onEdit }: PlaylistsPageProps) {

    const [playlists, setPlaylists] = useState<PlaylistEntity[]>([]);
    const [loading, setLoading] = useState(true);
  

    const loadPlaylists = () => {
        playlistApi.playlistsControllerFindAll(
            (error: any, data: PlaylistEntity[]) => {

                console.log("PLAYLIST ERROR:", error);
                console.log("PLAYLIST DATA:", data);

                if (error) {
                    console.error(
                        "Błąd pobierania:",
                        error
                    );
                    setLoading(false);
                    return;
                }

                setPlaylists(data ?? []);
               
                setLoading(false);
            }
        );
    };



    useEffect(() => {
        loadPlaylists();
    }, []);

    const createPlaylist = () => {
        playlistApi.playlistsControllerCreate(
            {
                name: "Nowa playlista",
                description: "",
            },
            (error, playlist) => {
                if (error) {
                    console.error(error);
                    return;
                }

                if (!playlist) {
                    console.error("Nie otrzymano danych playlisty");
                    return;
                }

                onEdit(playlist.id);
            }
        );
    };


    const deletePlaylist = (id: number) => {

        if (!confirm("Usunąć playlistę?")) {
            return;
        }

        playlistApi.playlistsControllerDelete(
            id,
            (error) => {

                if (error) {
                    console.error(
                        "Błąd usuwania:",
                        error
                    );
                    return;
                }


                setPlaylists(current =>
                    current.filter(
                        playlist => playlist.id !== id
                    )
                );

            }
        );

    };



    if (loading) {
        return <p>Ładowanie...</p>;
    }



    return (
    <main className="page">
        <header className="page-header playlist-page-header">
            <div>
                <h1>Playlisty</h1>

                <p className="page-description">
                    Zarządzanie playlistami wyświetlanymi na ekranach.
                </p>
            </div>

            <button
                className="primary-button"
                onClick={createPlaylist}
            >
                + Nowa playlista
            </button>
        </header>

        <section className="page-section">
            {playlists.length === 0 ? (
                <div className="empty-state">
                    <h2>Brak playlist</h2>

                    <p>
                        Nie utworzono jeszcze żadnej playlisty.
                    </p>
                </div>
            ) : (
                <PlaylistList
                    playlists={playlists}
                    onDelete={deletePlaylist}
                    onEdit={onEdit}
                />
            )}
        </section>
    </main>
);


}   