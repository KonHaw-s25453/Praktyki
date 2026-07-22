import { useEffect, useState } from "react";

import PlaylistsApi from "../api/src/api/PlaylistsApi";
import type { PlaylistEntity } from "../api/src/model/PlaylistEntity";
import UpdatePlaylistDto from "../api/src/model/UpdatePlaylistDto";
import AddItemToPlaylistDto from "../api/src/model/AddItemToPlaylistDto";
import FilesApi from "../api/src/api/FilesApi";
import type { FileEntity } from "../api/src/model/FileEntity";
import type { PlaylistItemEntity } from "../api/src/model/PlaylistItemEntity";

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

    const availableFiles = files.filter(file =>
    !playlist.items?.some(
        item => item.file?.id === file.id
    )
);

const reorderItems = (items: PlaylistItemEntity[]) => {

    const dto = {
        itemIds: items.map(item => item.id!)
    };


    playlistsApi.playlistsControllerReorderItems(
        playlist.id!,
        dto,
        (error) => {

            if (error) {
                console.error(
                    "Błąd zmiany kolejności:",
                    error
                );
                return;
            }


            playlistsApi.playlistsControllerFindById(
                playlist.id!,
                (error, data) => {
                    if (!error && data) {
                        setPlaylist(data);
                    }
                }
            );

        }
    );
};


const moveItem = (index: number, direction: number) => {

    const items = [...(playlist.items ?? [])];

    const newIndex = index + direction;

    if (
        newIndex < 0 ||
        newIndex >= items.length
    ) {
        return;
    }


    [
        items[index],
        items[newIndex]
    ] = [
        items[newIndex],
        items[index]
    ];


    const updatedItems = items.map((item, index) => ({
        ...item,
        position: index + 1
    }));


    setPlaylist({
        ...playlist,
        items: updatedItems
    });


    reorderItems(updatedItems);
};

    const removeItem = (itemId: number) => {

        if (!confirm("Usunąć element z playlisty?")) {
        return;
    }

    playlistsApi.playlistsControllerRemoveItem(
        playlist.id!,
        itemId,
        (error) => {

            if (error) {
                console.error(
                    "Błąd usuwania:",
                    error
                );
                return;
            }

            playlistsApi.playlistsControllerFindById(
                playlist.id!,
                (error, data) => {

                    if (!error && data) {
                        setPlaylist(data);
                    }

                }
            );

        }
    );
};



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
    Aktualna zawartość playlisty
</h3>

{playlist.items?.length === 0 && (
    <p>
        Playlista jest pusta.
    </p>
)}

{[...(playlist.items ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((item, index) => (
    <div key={item.id}>

        <b>
            {item.position}.
        </b>

        {" "}

        {item.file?.originalName ?? "Brak pliku"}

        {" ("}
    {item.duration}s
        {")"}

    <button
    onClick={() => moveItem(index, -1)}
>
↑
</button>

<button
    onClick={() => moveItem(index, 1)}
>
↓
</button>

    <button
        onClick={() => removeItem(item.id!)}
    >
        Usuń
    </button>
    </div>
))}

<h3>
    Dodaj plik
</h3>


{availableFiles.length === 0 && (
    <p>
        Wszystkie pliki są już w playliście.
    </p>
)}


{availableFiles.map(file => (

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