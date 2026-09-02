import { useEffect, useState } from "react";
import ScreensApi from "../api/src/api/ScreensApi";
import PlaylistsApi from "../api/src/api/PlaylistsApi";
import UpdateScreenPlaylistDto from "../api/src/model/UpdateScreenPlaylistDto";
import AssignPlaylistDto from "../api/src/model/AssignPlaylistDto";
import CreateScreenDto from "../api/src/model/CreateScreenDto";
import type { PlaylistEntity } from "../api/src/model/PlaylistEntity";

type ScreenEditPageProps = {
    screenId: number | null;
    onBack: () => void;
    onDirtyChange: (dirty: boolean) => void;
};

const screensApi = new ScreensApi();
const playlistsApi = new PlaylistsApi();


export default function ScreenEditPage({
    screenId,
    onBack,
    onDirtyChange,
}: ScreenEditPageProps) 
{
const [assignment, setAssignment] = useState<any>(null);
const [playlists, setPlaylists] = useState<PlaylistEntity[]>([]);

const [activeFrom, setActiveFrom] = useState("");
const [activeTo, setActiveTo] = useState("");
const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
const [isDirty, setIsDirty] = useState(false);
const [showSaveDialog, setShowSaveDialog] = useState(false);
const [name, setName] = useState("");
const [location, setLocation] = useState("");


useEffect(() => {

    if (screenId === null) {
    setName("");
    setLocation("");
    setAssignment(null);
    setSelectedPlaylistId(null);

    setActiveFrom("");
    setActiveTo("");
    setIsDirty(false);
    onDirtyChange(false);
    return;
}

    screensApi.screensControllerFindById(
        screenId,
        (error, data) => {


            if (!error && data) {

    setName(data.name ?? "");
    setLocation(data.location ?? "");

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

    setIsDirty(false);
    onDirtyChange(false);

}, [assignment]);


/*useEffect(() => {
    console.log(
        "SELECTED CHANGED:",
        selectedPlaylistId
    );
}, [selectedPlaylistId]);
*/

useEffect(() => {

        //console.log( "SELECTED CHANGED:", selectedPlaylistId);

    playlistsApi.playlistsControllerFindAll(
        (error, data) => {

        //console.log("BEFORE SET PLAYLISTS");
        //console.log("DATA:", data);


            if (!error) {
                setPlaylists(data ?? []);
            }

        }
    );

}, []);



const assignPlaylist = (playlistId:number) => {

  if (screenId === null) {
    console.error("Najpierw zapisz ekran.");
    return;
}

    const dto = new UpdateScreenPlaylistDto();


    dto.activeFrom = activeFrom || undefined;
    dto.activeTo = activeTo || undefined;


    if (assignment) {

        screensApi.screensControllerUpdateAssignment(
            screenId,
            assignment.playlistId,
            dto,
            (error) => {
                if(error){
                    console.error(error);
                    return;
                }

                //console.log("Playlist updated");
                setIsDirty(false);
                onDirtyChange(false);
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

                //console.log("Playlist assigned");
                setIsDirty(false);
                onDirtyChange(false);

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
    }
};

const requestLeave = () => {
    if (isDirty) {
        setShowSaveDialog(true);
        return;
    }
    onBack()
};


const saveScreen = () => {

    if (screenId === null) {

        const dto = new CreateScreenDto(name);

        dto.location = location;

        screensApi.screensControllerCreate(
            dto,
            (error) => {

                if (error) {
                    console.error(error);
                    return;
                }

                setIsDirty(false);
                onDirtyChange(false);
                onBack();
            }
        );

        return;
    }

    screensApi.screensControllerUpdate(
        screenId,
        {
            name,
            location,
        },
        (error) => {

            if (error) {
                console.error(error);
                return;
            }

            setIsDirty(false);
            onDirtyChange(false);
        }
    );
};



return (
    <main className="page screen-edit-page">

        <header className="page-header">
            <div>
                <h1>
                    {screenId === null
                        ? "Dodaj ekran"
                        : "Edycja ekranu"}
                </h1>

                <p className="page-description">
                    Skonfiguruj ekran i przypisz do niego playlistę.
                </p>
            </div>

            <button
                className="secondary-button"
                onClick={requestLeave}
            >
                ← Powrót do ekranów
            </button>
        </header>


        <section className="screen-edit-section page-section">

            <div className="section-header">
                <h2>Dane ekranu</h2>
            </div>

            <div className="screen-form">

                <label className="form-field">
                    <span>Nazwa</span>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setIsDirty(true);
                            onDirtyChange(true);
                        }}
                    />
                </label>


                <label className="form-field">
                    <span>Lokalizacja</span>

                    <input
                        type="text"
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                            setIsDirty(true);
                            onDirtyChange(true);
                        }}
                    />
                </label>

            </div>

            <div className="form-actions">

                <button
                    className="primary-button"
                    onClick={saveScreen}
                >
                    Zapisz dane ekranu
                </button>

            </div>

        </section>


        <section className="screen-edit-section page-section">

            <div className="section-header">
                <h2>Przypisanie playlisty</h2>
            </div>


            {assignment ? (
                <div className="assignment-info">
                    <span className="form-field-label">
                        Aktualnie przypisana playlista
                    </span>

                    <strong>
                        Playlist ID: {assignment.playlistId}
                    </strong>
                </div>
            ) : (
                <p className="empty-state">
                    Brak przypisanej playlisty.
                </p>
            )}


            <div className="screen-form">

                <label className="form-field">
                    <span>Playlista</span>

                    <select
                        value={selectedPlaylistId ?? ""}
                        onChange={(e) => {
                            setSelectedPlaylistId(
                                e.target.value === ""
                                    ? null
                                    : Number(e.target.value)
                            );

                            setIsDirty(true);
                            onDirtyChange(true);
                        }}
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

                <div className="form-row">

                    <label className="form-field">
                        <span>Aktywne od</span>

                        <input
                            type="date"
                            value={activeFrom}
                            onChange={(e) => {
                                setActiveFrom(e.target.value);
                                setIsDirty(true);
                                onDirtyChange(true);
                            }}
                        />
                    </label>


                    <label className="form-field">
                        <span>Aktywne do</span>

                        <input
                            type="date"
                            value={activeTo}
                            onChange={(e) => {
                                setActiveTo(e.target.value);
                                setIsDirty(true);
                                onDirtyChange(true);
                            }}
                        />
                    </label>

                </div>

            </div>


            <div className="form-actions">

                <button
                    className="primary-button"
                    disabled={screenId === null}
                    onClick={() => {
                        if (selectedPlaylistId === null) {
                            console.error(
                                "Nie wybrano playlisty"
                            );
                            return;
                        }

                        assignPlaylist(selectedPlaylistId);
                    }}
                >
                    Zapisz przypisanie
                </button>

            </div>

        </section>


        {showSaveDialog && (
            <div className="save-dialog-overlay">

                <div className="save-dialog">

                    <h2>
                        Niezapisane zmiany
                    </h2>

                    <p>
                        Masz niezapisane zmiany.
                        Czy chcesz je zapisać przed wyjściem?
                    </p>

                    <div className="save-dialog-actions">

                        <button
                            className="primary-button"
                            onClick={() => {
                                if (selectedPlaylistId !== null) {
                                    assignPlaylist(selectedPlaylistId);
                                }

                                setShowSaveDialog(false);
                            }}
                        >
                            Zapisz
                        </button>


                        <button
                            className="danger-button"
                            onClick={() => {
                                setIsDirty(false);
                                onDirtyChange(false);
                                setShowSaveDialog(false);
                                onBack();
                            }}
                        >
                            Odrzuć
                        </button>


                        <button
                            className="secondary-button"
                            onClick={() => {
                                setShowSaveDialog(false);
                            }}
                        >
                            Anuluj
                        </button>

                    </div>

                </div>

            </div>
        )}

    </main>
);
};