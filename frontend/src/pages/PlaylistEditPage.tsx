import { useEffect, useState } from "react";

import PlaylistsApi from "../api/src/api/PlaylistsApi";
import type { PlaylistEntity } from "../api/src/model/PlaylistEntity";
import AddItemToPlaylistDto from "../api/src/model/AddItemToPlaylistDto";
import FilesApi from "../api/src/api/FilesApi";
import type { FileEntity } from "../api/src/model/FileEntity";

type PlaylistEditPageProps = {
    playlistId: number | null;
    onBack: () => void;
    onDirtyChange: (dirty: boolean) => void;
};


const playlistsApi = new PlaylistsApi();
const filesApi = new FilesApi();



export default function PlaylistEditPage({
    playlistId,
    onBack,
    onDirtyChange,
}: PlaylistEditPageProps) {

    const [playlist, setPlaylist] = useState<PlaylistEntity | null>(null);
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState<FileEntity[]>([]);
    const [isDirty, setIsDirty] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);

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
                setIsDirty(false);
                setLoading(false);
                onDirtyChange(false);
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


/*
const reorderItems = (items: PlaylistItemEntity[]) => {

    const dto = {
        itemIds: items.map(item => item.id!)
    };


    playlistsApi.playlistsControllerReorderItems(
         playlist.id!,
        dto,
        (error) => {

            if (error) {
                console.error("Błąd zmiany kolejności:", error);
                return;
            }

        // Nic więcej.
        // Stan Reacta już został zaktualizowany w moveItem().
    }
    );
};
*/

const moveItem = (index: number, direction: number) => {

console.log(
    "STATE ORDER:",
    playlist.items?.map(i => ({
        id: i.id,
        pos: i.position,
        dur: i.duration
    }))
);

console.log(
    "CLICKED INDEX:",
    index
);



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
    setIsDirty(true);
    onDirtyChange(true);

    console.log("AFTER MOVE:", updatedItems);
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
                        setIsDirty(true);
                        onDirtyChange(true);
                           
                    }
                }
            );

        }
    );
    }

    
    const savePlaylist = () => {

    console.log("SENDING PLAYLIST:", JSON.stringify(playlist, null, 2));

    if (!playlist) {
        return;
    }

       const dto = {
        name: playlist.name,
        description: playlist.description ?? "",
        repeatMode: playlist.repeatMode,
        items: playlist.items.map(item => ({
            id: item.id,
            duration: item.duration,
            position: item.position,
            videoLoops: item.videoLoops ?? 1 
        }))
    };

    console.log("SENDING DTO:", JSON.stringify(dto, null, 2));


playlistsApi.playlistsControllerUpdate(
    playlist.id!,
    dto,
    (error: any, data: PlaylistEntity) => {

        if (error) {
            console.error(error);
            return;
        }

        setPlaylist(data);
        setIsDirty(false);
        onDirtyChange(false);
    }
    
);
    };

    const sortedItems = [...(playlist.items ?? [])].sort(
    (a, b) => a.position - b.position
);

const requestLeave = () => {

    if (isDirty) {
        setShowSaveDialog(true);
        return;
    }

    onBack();
};


    return (
        <div>

            <h1>
                Edycja playlisty
            </h1>

<button onClick={onBack}>
    ← Powrót do playlist
</button>

<h2>Nazwa Playlisty</h2><div>
           <input
    value={playlist.name}
    onChange={(e) =>{
        setPlaylist({
            ...playlist,
            name: e.target.value,
        });

        setIsDirty(true);
        onDirtyChange(true);

    }}
/>
</div>.

<h2>Opis Playlisty</h2><div>
<textarea
   value={playlist.description ?? ""}
    onChange={(e) => {
        setPlaylist({
            ...playlist,
            description: e.target.value,
        });

        setIsDirty(true);
        onDirtyChange(true);
    }}
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

{sortedItems.map((item, index) => (
    <div key={item.id}>

        <b>
            {item.position}.
        </b>

        {" "}

        {item.file?.originalName ?? "Brak pliku"}

       {" "}

<input
    type="number"
    min="1"
    value={item.duration ?? 30}
    onChange={(e) => {
    const newItems = playlist.items?.map(i =>
        i.id === item.id
            ? {
                ...i,
                duration: Number(e.target.value)
            }
            : i
    );

    setPlaylist({
        ...playlist,
        items: newItems
    });

    setIsDirty(true);
    onDirtyChange(true);
}}
/>

sek.


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


{files.length === 0 && (
    <p>
        Brak plików w bibliotece.
    </p>
)}


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

{showSaveDialog && (
    <div>
        <div>
            Masz niezapisane zmiany.
        </div>

        <button
            onClick={() => {
                savePlaylist();
                setShowSaveDialog(false);
            }}
        >
            Zapisz
        </button>

        <button
            onClick={() => {
                setIsDirty(false);
                onDirtyChange(false);
                setShowSaveDialog(false);

                // tutaj później przejście dalej
            }}
        >
            Odrzuć
        </button>


        <button
            onClick={() => {
                setShowSaveDialog(false);
            }}
        >
            Anuluj
        </button>

    </div>
)}


 <button onClick={requestLeave}>
    ← Powrót
</button>

</div>
);
}