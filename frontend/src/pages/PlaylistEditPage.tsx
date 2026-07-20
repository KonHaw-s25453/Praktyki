import { useEffect, useState } from "react";

import PlaylistsApi from "../api/src/api/PlaylistsApi";
import type { PlaylistEntity } from "../api/src/model/PlaylistEntity";


type PlaylistEditPageProps = {
    playlistId: number | null;
};


const playlistsApi = new PlaylistsApi();


export default function PlaylistEditPage({
    playlistId,
}: PlaylistEditPageProps) {

    const [playlist, setPlaylist] = useState<PlaylistEntity | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        if (playlistId === null) {
            setLoading(false);
            return;
        }


        playlistsApi.playlistsControllerFindById(
            playlistId,
            (error: any, data: PlaylistEntity) => {

                console.log("PLAYLIST EDIT ERROR:", error);
                console.log("PLAYLIST EDIT DATA:", data);


                if (error) {
                    console.error(
                        "Błąd pobierania playlisty:",
                        error
                    );
                    setLoading(false);
                    return;
                }


                setPlaylist(data);
                setLoading(false);
            }
        );

    }, [playlistId]);


    if (loading) {
        return <p>Ładowanie playlisty...</p>;
    }


    if (playlistId === null) {
        return <p>Nie wybrano playlisty.</p>;
    }


    if (!playlist) {
        return <p>Nie znaleziono playlisty.</p>;
    }


    return (
        <div>

            <h1>
                Edycja playlisty
            </h1>


            <h2>
                {playlist.name}
            </h2>


            <p>
                ID: {playlist.id}
            </p>

        </div>
    );
}