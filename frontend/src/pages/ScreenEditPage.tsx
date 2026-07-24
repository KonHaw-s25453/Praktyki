import { useEffect, useState } from "react";

import ScreensApi from "../api/src/api/ScreensApi";
import PlaylistsApi from "../api/src/api/PlaylistsApi";

import AssignPlaylistDto from "../api/src/model/AssignPlaylistDto";

import type { PlaylistEntity } from "../api/src/model/PlaylistEntity";

type ScreenEditPageProps = {
    screenId: number | null;
};

const screensApi = new ScreensApi();
const playlistsApi = new PlaylistsApi();


export default function ScreenEditPage({
    screenId,
}: ScreenEditPageProps) {
const [assignment, setAssignment] = useState<any>(null);
const [playlists, setPlaylists] = useState<PlaylistEntity[]>([]);
const [loading, setLoading] = useState(true);
const [priority, setPriority] = useState(10);
const [activeFrom, setActiveFrom] = useState("");
const [activeTo, setActiveTo] = useState("");
const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);

useEffect(() => {

    if (screenId === null) {
        setLoading(false);
        return;
    }


    screensApi.screensControllerFindById(
        screenId!,
        (error, data) => {

            console.log(
                "SCREEN ASSIGNMENT:",
                data
            );


          if (!error) {
    setAssignment(data);

    setSelectedPlaylistId(data.playlistId);

    setPriority(data.priority ?? 10);

    setActiveFrom(
        data.activeFrom
        ? data.activeFrom.substring(0, 10)
        : ""
    );

    setActiveTo(
        data.activeTo
        ? data.activeTo.substring(0, 10)
        : ""
    );
}

            setLoading(false);
        }
    );

}, [screenId]);

useEffect(() => {

    playlistsApi.playlistsControllerFindAll(
        (error, data) => {

            if (!error) {
                setPlaylists(data ?? []);
            }

        }
    );

}, []);

const assignPlaylist = (playlistId:number) => {

    const dto = new AssignPlaylistDto(
        playlistId
    );


    dto.priority = priority;
    dto.activeFrom = activeFrom || undefined;
    dto.activeTo = activeTo || undefined;


    screensApi.screensControllerAssignPlaylist(
        screenId!,
        dto,
        (error) => {

            if(error){
                console.error(error);
                return;
            }
             console.log("Playlist assigned");

            screensApi.screensControllerFindById(
                screenId!,
                (error, data) => {

                    if (!error) {
                        setAssignment(data);
                        setSelectedPlaylistId(data.playlistId);
                    }

                }
            );

        }
    );

};

return (
    <div>

        <h1>
            Edycja ekranu
        </h1>


        {loading && (
            <p>
                Ładowanie...
            </p>
        )}


        {!loading && assignment && (
            <>
                <h2>
                    Przypisana playlista
                </h2>

                <p>
                    Aktualna playlist ID:
                    {" "}
                    {assignment.playlistId}
                </p>


                <select
                value={selectedPlaylistId ?? ""}
                onChange={(e) =>
                setSelectedPlaylistId(
                Number(e.target.value)
                        )
                    }
                >

                    <option value="">
                        -- wybierz playlistę --
                    </option>


                    {playlists.map(playlist => (

                        <option
                            key={playlist.id}
                            value={playlist.id}
                        >
                            {playlist.name}
                        </option>

                    ))}

                </select>

            </>
        )}

<h2>
    Priorytet
</h2>

<input
    type="number"
    value={priority}
    onChange={(e) =>
        setPriority(
            Number(e.target.value)
        )
    }
/>


<h2>
    Aktywne od
</h2>

<input
    type="date"
    value={activeFrom}
    onChange={(e) =>
        setActiveFrom(e.target.value)
    }
/>


<h2>
    Aktywne do
</h2>

<input
    type="date"
    value={activeTo}
    onChange={(e) =>
        setActiveTo(e.target.value)
    }
/>

<button
    onClick={() => {

        if (selectedPlaylistId === null) {
            console.error("Nie wybrano playlisty");
            return;
        }

        assignPlaylist(selectedPlaylistId);
    }}
>
    Zapisz przypisanie
</button>

    </div>
);
};