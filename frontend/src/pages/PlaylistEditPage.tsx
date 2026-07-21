import { useEffect, useState } from "react";

import PlaylistsApi from "../api/src/api/PlaylistsApi";
import type { PlaylistEntity } from "../api/src/model/PlaylistEntity";
import UpdatePlaylistDto from "../api/src/model/UpdatePlaylistDto";
import AddItemToPlaylistDto from "../api/src/model/AddItemToPlaylistDto";
import FilesApi from "../api/src/api/FilesApi";
import type { FileEntity } from "../api/src/model/FileEntity";

type PlaylistEditPageProps = {
    playlistId: number | null;
};


const playlistsApi = new PlaylistsApi();
const filesApi = new FilesApi();

export default function PlaylistEditPage({
    playlistId,
}: PlaylistEditPageProps) {

    const [playlist, setPlaylist] = useState<PlaylistEntity | null>(null);
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState<FileEntity[]>([]);

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

    useEffect(() => {

    filesApi.filesControllerFindAll(
        (error, data) => {

            console.log("FILES DATA:", data);

            if (!error) {
                setFiles(data ?? []);
            }

        }
    );

}, []);

    
    if (loading) {
        return <p>Ładowanie playlisty...</p>;
    }


    if (playlistId === null) {
        return <p>Nie wybrano playlisty.</p>;
    }


    if (!playlist) {
        return <p>Nie znaleziono playlisty.</p>;
    }

    const addFileToPlaylist = (fileId: number) => {

    console.log("FILE ID:", fileId);
    if (!playlist) {
        return;
    }

    const position = playlist.items.length > 0
        ? Math.max(...playlist.items.map(item => item.position)) + 1
        : 1;


    const dto = new AddItemToPlaylistDto(
        fileId,
        position,
        30
    );
  

   console.log("PLAYLIST:", playlist);
    console.log("ITEMS:", playlist.items);
    console.log("POSITION:", position);
    console.log("DTO:", dto);

    playlistsApi.playlistsControllerAddItem(
        playlist.id!,
        dto,
        (error, data) => {

            if (error) {
                console.error(
                    "Błąd dodawania pliku:",
                    error.response?.body ?? error
                );
                return;
            }


            console.log(
                "Dodano element:",
                data
            );


            playlistsApi.playlistsControllerFindById(
                playlist.id!,
                (error, data) => {
                    if (!error && data) {
                        console.log("UPDATED PLAYLIST:", data);
                        console.log("UPDATED ITEMS:", data.items);
                        setPlaylist(data);   
                    }
                }
            );

        }
    );
    }

    const savePlaylist = () => {

    if (!playlist) {
        return;
    }

    const dto = new UpdatePlaylistDto(
    playlist.name,
    playlist.description ?? ""
);

playlistsApi.playlistsControllerUpdate(
    playlist.id!,
    dto,
    (error: any, data: PlaylistEntity) => {

        if (error) {
            console.error(error);
            return;
        }

        setPlaylist(data);
    }
);

};
    return (
        <div>

            <h1>
                Edycja playlisty
            </h1>

<h2>Nazwa Playlisty</h2><div>
           <input
    value={playlist.name}
    onChange={(e) =>
        setPlaylist({
            ...playlist,
            name: e.target.value,
        })
    }
/>
</div>.

<h2>Opis Playlisty</h2><div>
<textarea
    value={playlist.description ?? ""}
    onChange={(e) =>
        setPlaylist({
            ...playlist,
            description: e.target.value,
        })
    }
/>
</div>

  <button onClick={savePlaylist}>
    Zapisz
</button>

<h3>
    Dodaj plik
</h3>


{files.map(file => (

    <div key={file.id}>

        {file.originalName}

        <button
            onClick={() => addFileToPlaylist(file.id!)}
        >
            Dodaj
        </button>

    </div>

))}


</div>
);
}