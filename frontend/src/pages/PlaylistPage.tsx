import { useEffect, useState } from "react";

import PlaylistsApi from "../api/src/api/PlaylistsApi";

import PlaylistList from "../components/PlaylistList";

import type { PlaylistEntity } from "../api/src/model/PlaylistEntity";



const filesApi = new PlaylistsApi();

type PlaylistsPageProps = {
    onEdit: (playlistId: number) => void;
};

export default function PlaylistsPage({ onEdit }: PlaylistsPageProps) {

    const [playlists, setPlaylists] = useState<PlaylistEntity[]>([]);
    const [loading, setLoading] = useState(true);


    const loadPlaylists = () => {
    filesApi.playlistsControllerFindAll(
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



    const deletePlaylist = (id: number) => {

        filesApi.playlistsControllerDelete(
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
        <div>

            <h1>
                Biblioteka List Odtwarzania
            </h1>

            <PlaylistList
    playlists={playlists}
    onDelete={deletePlaylist}
    onEdit={onEdit}
/>  

        </div>
    );


}   