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

    const [playlist, setPlaylist] =
        useState<PlaylistEntity | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [files, setFiles] =
        useState<FileEntity[]>([]);

    const [isDirty, setIsDirty] =
        useState(false);

    const [showSaveDialog, setShowSaveDialog] =
        useState(false);


    /*
     * Pobieranie playlisty
     */

    useEffect(() => {

        if (playlistId === null) {
            setLoading(false);
            return;
        }

        playlistsApi.playlistsControllerFindById(
            playlistId,
            (error: any, data: PlaylistEntity) => {

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


    /*
     * Pobieranie biblioteki plików
     */

    useEffect(() => {

        filesApi.filesControllerFindAll(
            (error, data) => {

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
     * Zmiana kolejności elementów
     */

    const moveItem = (
        index: number,
        direction: number
    ) => {

        const items = [
            ...(playlist.items ?? [])
        ];

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

        const updatedItems = items.map(
            (item, index) => ({
                ...item,
                position: index + 1
            })
        );

        setPlaylist({
            ...playlist,
            items: updatedItems
        });

        setIsDirty(true);
        onDirtyChange(true);
    };


    /*
     * Usuwanie elementu z playlisty
     */

    const removeItem = (itemId: number) => {

        if (!confirm(
            "Usunąć element z playlisty?"
        )) {
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
                            setIsDirty(true);
                            onDirtyChange(true);
                        }

                    }
                );

            }
        );
    };


    /*
     * Dodawanie pliku do playlisty
     */

    const addFileToPlaylist = (
        fileId: number
    ) => {

        if (!playlist) {
            return;
        }

        const position =
            playlist.items.length > 0
                ? Math.max(
                    ...playlist.items.map(
                        item => item.position
                    )
                ) + 1
                : 1;


        const dto = new AddItemToPlaylistDto(
            fileId,
            position,
            30
        );


        playlistsApi.playlistsControllerAddItem(
            playlist.id!,
            dto,
            (error) => {

                if (error) {
                    console.error(
                        "Błąd dodawania pliku:",
                        error.response?.body ?? error
                    );

                    return;
                }


                playlistsApi.playlistsControllerFindById(
                    playlist.id!,
                    (error, data) => {

                        if (!error && data) {

                            setPlaylist(data);

                            setIsDirty(true);
                            onDirtyChange(true);
                        }

                    }
                );

            }
        );
    };


    /*
     * Zapisywanie playlisty
     */

    const savePlaylist = () => {

        if (!playlist) {
            return;
        }


        const dto = {
            name: playlist.name,

            description:
                playlist.description ?? "",

            repeatMode:
                playlist.repeatMode,

            items:
                playlist.items.map(item => ({
                    id: item.id,
                    duration: item.duration,
                    position: item.position,
                    videoLoops:
                        item.videoLoops ?? 1
                }))
        };


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


    /*
     * Elementy posortowane według pozycji
     */

    const sortedItems = [
        ...(playlist.items ?? [])
    ].sort(
        (a, b) => a.position - b.position
    );


    /*
     * Próba opuszczenia edycji
     */

    const requestLeave = () => {

        if (isDirty) {
            setShowSaveDialog(true);
            return;
        }

        onBack();
    };


    return (
        <div className="page playlist-edit-page">

            <header className="page-header">

                <div>
                    <h1>Edycja playlisty</h1>

                    <p className="page-description">
                        Edytuj ustawienia i zawartość playlisty.
                    </p>
                </div>

                <button
                    className="secondary-button"
                    onClick={requestLeave}
                >
                    ← Powrót do playlist
                </button>

            </header>


            {/* USTAWIENIA */}

            <section className="playlist-settings page-section">

                <div className="section-header">
                    <h2>Ustawienia playlisty</h2>
                </div>


                <div className="form-group">

                    <label htmlFor="playlist-name">
                        Nazwa playlisty
                    </label>

                    <input
                        id="playlist-name"
                        value={playlist.name}
                        onChange={(e) => {

                            setPlaylist({
                                ...playlist,
                                name: e.target.value,
                            });

                            setIsDirty(true);
                            onDirtyChange(true);
                        }}
                    />

                </div>


                <div className="form-group">

                    <label htmlFor="playlist-description">
                        Opis playlisty
                    </label>

                    <textarea
                        id="playlist-description"
                        value={
                            playlist.description ?? ""
                        }
                        onChange={(e) => {

                            setPlaylist({
                                ...playlist,
                                description:
                                    e.target.value,
                            });

                            setIsDirty(true);
                            onDirtyChange(true);
                        }}
                    />

                </div>


                <button
                    className="primary-button"
                    onClick={savePlaylist}
                >
                    Zapisz zmiany
                </button>

            </section>


            {/* ZAWARTOŚĆ PLAYLISTY */}

            <section className="playlist-content page-section">

                <div className="section-header">

                    <div>
                        <h2>
                            Aktualna zawartość playlisty
                        </h2>

                        <p className="page-description">
                            Kolejność i czas wyświetlania plików.
                        </p>
                    </div>

                </div>


                {sortedItems.length === 0 && (
                    <div className="empty-state">
                        Playlista jest pusta.
                    </div>
                )}


                <div className="playlist-items">

                    {sortedItems.map(
                        (item, index) => (

                            <div
                                key={item.id}
                                className="playlist-item"
                            >

                                <div className="playlist-item-position">
                                    {item.position}.
                                </div>


                                <div className="playlist-item-name">
                                    {item.file?.originalName ??
                                        "Brak pliku"}
                                </div>


                                <div className="playlist-item-duration">

                                    <input
                                        type="number"
                                        min="1"
                                        value={
                                            item.duration ?? 30
                                        }
                                        onChange={(e) => {

                                            const newItems =
                                                playlist.items?.map(
                                                    i =>
                                                        i.id === item.id
                                                            ? {
                                                                ...i,
                                                                duration:
                                                                    Number(
                                                                        e.target.value
                                                                    )
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

                                    <span>sek.</span>

                                </div>


                                <div className="playlist-item-actions">

                                    <button
                                        onClick={() =>
                                            moveItem(
                                                index,
                                                -1
                                            )
                                        }
                                        disabled={
                                            index === 0
                                        }
                                        title="Przesuń w górę"
                                    >
                                        ↑
                                    </button>


                                    <button
                                        onClick={() =>
                                            moveItem(
                                                index,
                                                1
                                            )
                                        }
                                        disabled={
                                            index ===
                                            sortedItems.length - 1
                                        }
                                        title="Przesuń w dół"
                                    >
                                        ↓
                                    </button>


                                    <button
                                        className="danger-button"
                                        onClick={() =>
                                            removeItem(
                                                item.id!
                                            )
                                        }
                                    >
                                        Usuń
                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            </section>


            {/* DODAWANIE PLIKÓW */}

            <section className="playlist-add-files page-section">

                <div className="section-header">

                    <div>
                        <h2>Dodaj plik</h2>

                        <p className="page-description">
                            Wybierz plik z biblioteki,
                            aby dodać go do playlisty.
                        </p>
                    </div>

                </div>


                {files.length === 0 && (
                    <div className="empty-state">
                        Brak plików w bibliotece.
                    </div>
                )}


                <div className="playlist-file-list">

                    {files.map(file => (

                        <div
                            key={file.id}
                            className="playlist-file"
                        >

                            <div className="playlist-file-info">

                                <span className="playlist-file-name">
                                    {file.originalName}
                                </span>

                                <span className="playlist-file-type">
                                    {file.mimeType}
                                </span>

                            </div>


                            <button
                                className="secondary-button"
                                onClick={() =>
                                    addFileToPlaylist(
                                        file.id!
                                    )
                                }
                            >
                                Dodaj
                            </button>

                        </div>

                    ))}

                </div>

            </section>


            {/* DIALOG NIEZAPISANYCH ZMIAN */}

            {showSaveDialog && (

                <div className="dialog-backdrop">

                    <div className="save-dialog">

                        <h2>
                            Niezapisane zmiany
                        </h2>

                        <p>
                            Masz niezapisane zmiany
                            w tej playliście.
                            Co chcesz zrobić?
                        </p>


                        <div className="dialog-actions">

                            <button
                                className="primary-button"
                                onClick={() => {

                                    savePlaylist();
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
                                Odrzuć zmiany
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

        </div>
    );
}