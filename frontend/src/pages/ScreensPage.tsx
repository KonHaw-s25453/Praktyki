import { useEffect, useState } from "react";

import ScreensApi from "../api/src/api/ScreensApi";

type Screen = {
    id: number;
    name: string;
    location: string;
    apiKey: string;
    fallbackFileId: number;
    playerUrl: string | null;
    lastSeen: string;
    createdAt: string;
    isOnline: boolean;
    state: {
        visible: boolean;
    } | null;
    screenPlaylists: any[];
};

const screensApi = new ScreensApi();

type ScreensPageProps = {
    onEdit: (screenId: number | null) => void;
};

export default function ScreensPage({
    onEdit,
}: ScreensPageProps) {

    const [screens, setScreens] =
        useState<Screen[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const loadScreens = () => {
            screensApi.screensControllerFindAll(
                (error, data) => {
                    console.log("SCREENS ERROR:", error);
                    console.log("SCREENS DATA:", data);
                    console.log( "SCREENS DETAILS:",
                         data?.map(screen => ({
                         id: screen.id,
                         name: screen.name,
                         isOnline: screen.isOnline,
                         lastSeen: screen.lastSeen,
                        }))
);
                    if (!error) {
                        setScreens(data ?? []);
                    }

                    setLoading(false);
                }
            );
        };

        loadScreens();

        const interval = setInterval(loadScreens, 5000);

        return () => clearInterval(interval);

    }, []);


    const deleteScreen = async (screenId: number) => {

        const screen = screens.find(
            screen => screen.id === screenId
        );

        if (!screen) {
            return;
        }

        const confirmed = window.confirm(
            `Czy na pewno chcesz usunąć ekran "${screen.name}" (ID: ${screen.id})?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL;

            const response = await fetch(
                `${API_URL}/screens/${screenId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Nie udało się usunąć ekranu: ${response.status}`
                );
            }

            setScreens(prev =>
                prev.filter(screen => screen.id !== screenId)
            );

        } catch (error) {
            console.error("SCREEN DELETE ERROR:", error);

            alert(
                "Nie udało się usunąć ekranu."
            );
        }
    };


    if (loading) {
        return <p>Ładowanie ekranów...</p>;
    }


return (
    <main className="page screens-page">

        <header className="page-header">
            <div>
                <h1>Ekrany</h1>
                <p className="page-description">
                    Zarządzaj ekranami informacyjnymi i przypisanymi playlistami.
                </p>
            </div>

            <button
                className="primary-button"
                onClick={() => onEdit(null)}
            >
                + Dodaj ekran
            </button>
        </header>


        {screens.length === 0 ? (
            <section className="page-section">
                <div className="empty-state">
                    Brak ekranów.
                </div>
            </section>
        ) : (

            <section className="screens-list">

                {screens.map(screen => (

                    <article
                        key={screen.id}
                        className="screen-card"
                    >

                        <header className="screen-card-header">

                            <div>
                                <h2 className="screen-name">
                                    {screen.name}
                                </h2>

                                <p className="screen-location">
                                    {screen.location}
                                </p>
                            </div>

                            <span
                                className={
                                    screen.isOnline
                                        ? "status-badge status-online"
                                        : "status-badge status-offline"
                                }
                            >
                                {screen.isOnline
                                    ? "Online"
                                    : "Offline"}
                            </span>

                        </header>


                        <div className="screen-info">

                            <div className="screen-info-item">
                                <span className="screen-info-label">
                                    ID ekranu
                                </span>

                                <span>
                                    {screen.id}
                                </span>
                            </div>


                            <div className="screen-info-item">
                                <span className="screen-info-label">
                                    Widoczność
                                </span>

                                <span
                                    className={
                                        screen.state?.visible
                                            ? "status-visible"
                                            : "status-hidden"
                                    }
                                >
                                    {screen.state?.visible
                                        ? "🟢 Widoczny"
                                        : "⚫ Niewidoczny"}
                                </span>
                            </div>


                            <div className="screen-info-item">
                                <span className="screen-info-label">
                                    Ostatni kontakt
                                </span>

                                <span>
                                    {screen.lastSeen
                                        ? new Date(
                                            screen.lastSeen
                                        ).toLocaleString()
                                        : "Nigdy"}
                                </span>
                            </div>

                        </div>


                        <div className="screen-preview">

                            {screen.playerUrl ? (
                                <iframe
                                    src={`${screen.playerUrl}/?screenId=${screen.id}&preview=true`}
                                    title={`Podgląd ekranu ${screen.name}`}
                                />
                            ) : (
                                <div className="screen-preview-empty">
                                    Player tego ekranu nie zgłosił
                                    jeszcze swojego adresu.
                                </div>
                            )}

                        </div>


                        {screen.screenPlaylists.length > 0 && (

                            <section className="screen-playlists">

                                <h3>
                                    Playlisty
                                </h3>

                                <div className="screen-playlist-list">

                                    {screen.screenPlaylists.map(item => (

                                        <div
                                            key={item.id}
                                            className="screen-playlist-item"
                                        >
                                            <span>
                                                Playlist ID:{" "}
                                                <strong>
                                                    {item.playlistId}
                                                </strong>
                                            </span>

                                            <span>
                                                Priorytet:{" "}
                                                <strong>
                                                    {item.priority}
                                                </strong>
                                            </span>
                                        </div>

                                    ))}

                                </div>

                            </section>

                        )}


                        <footer className="screen-card-actions">

                            <button
                                className="secondary-button"
                                onClick={() =>
                                    onEdit(screen.id)
                                }
                            >
                                Edytuj
                            </button>

                            <button
                                className="danger-button"
                                onClick={() =>
                                    deleteScreen(screen.id)
                                }
                            >
                                Usuń
                            </button>

                        </footer>

                    </article>

                ))}

            </section>
        )}

    </main>
);
}