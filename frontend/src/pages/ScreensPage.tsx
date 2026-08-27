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
        <div>

            <h1>
                Ekrany
            </h1>


            {screens.length === 0 && (
                <p>
                    Brak ekranów.
                </p>
            )}


            {screens.map(screen => (
                <div
                    key={screen.id}
                    style={{
                        marginBottom: "30px",
                        padding: "15px",
                        border: "1px solid #ddd",
                        borderRadius: "8px"
                    }}
                >

                    <h3>
                        {screen.name}
                    </h3>

                    <p>
                        <strong>ID ekranu:</strong>{" "}
                        {screen.id}
                    </p>

                    <p>
                        Lokalizacja: {screen.location}
                    </p>

                    <p>
                        Widoczność:{" "}
                        {screen.state?.visible
                            ? "🟢 Widoczny"
                            : "⚫ Niewidoczny"
                        }
                    </p>

                    <p>
                        Status:{" "}
                        {screen.isOnline
                            ? "🟢 Online"
                            : "🔴 Offline"
                        }
                    </p>

                    <p>
                    Last seen: {screen.lastSeen
                        ? new Date(screen.lastSeen).toLocaleString()
                        : "Nigdy"}
                    </p>


                    <div
                        style={{
                            width: "640px",
                            marginBottom: "20px"
                        }}
                    >

                        {screen.playerUrl ? (
                            <iframe
                                src={`${screen.playerUrl}/?screenId=${screen.id}`}
                                title={`Podgląd ekranu ${screen.name}`}
                                style={{
                                    width: "100%",
                                    aspectRatio: "16 / 9",
                                    border: "1px solid #ccc",
                                    borderRadius: "8px"
                                }}
                            />
                        ) : (
                            <p>
                                Player tego ekranu nie zgłosił
                                jeszcze swojego adresu.
                            </p>
                        )}

                    </div>


                    {screen.screenPlaylists.length > 0 && (
                        <div>
                            <h4>
                                Playlisty:
                            </h4>

                            {screen.screenPlaylists.map(item => (
                                <p key={item.id}>
                                    Playlist ID: {item.playlistId}
                                    <br />
                                    Priorytet: {item.priority}
                                </p>
                            ))}
                        </div>
                    )}


                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "15px"
                        }}
                    >

                        <button
                            onClick={() =>
                                onEdit(screen.id)
                            }
                        >
                            Edytuj
                        </button>

                        <button
                            onClick={() =>
                                deleteScreen(screen.id)
                            }
                            style={{
                                color: "white",
                                backgroundColor: "crimson",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Usuń
                        </button>

                    </div>

                </div>
            ))}


            <button
                onClick={() => onEdit(null)}
            >
                + Dodaj ekran
            </button>

        </div>
    );
}