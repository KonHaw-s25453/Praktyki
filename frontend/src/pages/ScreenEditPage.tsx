import { useEffect, useState } from "react";
import ScreensApi from "../api/src/api/ScreensApi";
import PlaylistsApi from "../api/src/api/PlaylistsApi";
import UpdateScreenPlaylistDto from "../api/src/model/UpdateScreenPlaylistDto";
import AssignPlaylistDto from "../api/src/model/AssignPlaylistDto";
import type { PlaylistEntity } from "../api/src/model/PlaylistEntity";

type ScreenEditPageProps = {
    screenId: number | null;
};

const screensApi = new ScreensApi();
const playlistsApi = new PlaylistsApi();


export default function ScreenEditPage({
    screenId,
}: ScreenEditPageProps) 
{
const [assignment, setAssignment] = useState<any>(null);
const [playlists, setPlaylists] = useState<PlaylistEntity[]>([]);
const [priority, setPriority] = useState(10);
const [activeFrom, setActiveFrom] = useState("");
const [activeTo, setActiveTo] = useState("");
const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);

useEffect(() => {

    if (!screenId) {
        return;
    }

    screensApi.screensControllerFindById(
        screenId,
        (error, data) => {

            if (!error && data) {

                const assignment = data.screenPlaylists?.[0];

                setAssignment(
                    assignment ?? null
                );

            }
        }
    );

}, [screenId]);

useEffect(() => {
    if (!assignment) {
        return;
    }

    setSelectedPlaylistId(assignment.playlistId);

    setPriority(assignment.priority ?? 10);

    setActiveFrom(
        assignment.activeFrom
            ? assignment.activeFrom.substring(0, 10)
            : ""
    );

    setActiveTo(
        assignment.activeTo
            ? assignment.activeTo.substring(0, 10)
            : ""
    );

}, [assignment]);


useEffect(() => {
    console.log(
        "SELECTED CHANGED:",
        selectedPlaylistId
    );
}, [selectedPlaylistId]);


useEffect(() => {

        console.log( "SELECTED CHANGED:", selectedPlaylistId);

    playlistsApi.playlistsControllerFindAll(
        (error, data) => {

        console.log("BEFORE SET PLAYLISTS");
        console.log("DATA:", data);


            if (!error) {
                setPlaylists(data ?? []);
            }

        }
    );

}, []);



const assignPlaylist = (playlistId:number) => {

    if (!screenId) {
        console.error("Brak screenId");
        return;
    }

    const dto = new UpdateScreenPlaylistDto();

    dto.priority = priority;
    dto.activeFrom = activeFrom || undefined;
    dto.activeTo = activeTo || undefined;


    if (assignment) {

        screensApi.screensControllerUpdateAssignment(
            screenId,
            playlistId,
            dto,
            (error) => {
                if(error){
                    console.error(error);
                    return;
                }

                console.log("Playlist updated");

                screensApi.screensControllerFindById(
    screenId,
    (error, data) => {
        if (!error) {
            setAssignment(
                data.screenPlaylists?.[0] ?? null
            );
        }
    }
);
            }
        );

    } else {

        const assignDto = new AssignPlaylistDto(
            playlistId
        );

        assignDto.priority = priority;
        assignDto.activeFrom = activeFrom || undefined;
        assignDto.activeTo = activeTo || undefined;


        screensApi.screensControllerAssignPlaylist(
            screenId,
            assignDto,
            (error) => {
                if(error){
                    console.error(error);
                    return;
                }

                console.log("Playlist assigned");
            }
        );
    }
};

return (

    
    <div>

        <h1>
            Edycja ekranu
        </h1>

        {assignment ? (
            <>
                <h2>
                    Przypisana playlista
                </h2>

                <p>
                    Aktualna playlist ID:
                    {" "}
                    {assignment.playlistId}
                </p>
            </>
        ) : (
            <p>
                Brak przypisanej playlisty.
            </p>
        )}


        <label>
            Playlista:

            <select
                value={selectedPlaylistId ?? ""}
                onChange={(e) =>
                    setSelectedPlaylistId(
                        e.target.value === ""
                            ? null
                            : Number(e.target.value)
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

        </label>

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