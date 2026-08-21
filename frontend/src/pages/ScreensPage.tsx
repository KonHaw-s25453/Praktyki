import { useEffect, useState } from "react";

import ScreensApi from "../api/src/api/ScreensApi";

type Screen = {
    id: number;
    name: string;
    location: string;
    apiKey: string;
    fallbackFileId: number;
    lastSeen: string;
    createdAt: string;
    state: any;
    screenPlaylists: any[];
};


const screensApi = new ScreensApi();


type ScreensPageProps = {
    onEdit: (screenId: number) => void;
};


export default function ScreensPage({
    onEdit,
}: ScreensPageProps) {


    const [screens, setScreens] =
        useState<Screen[]>([]);


    const [loading, setLoading] =
        useState(true);



    useEffect(() => {

        screensApi.screensControllerFindAll(
            (error, data) => {
            /*console.log("SCREENS ERROR:", error);
            console.log("SCREENS DATA:", data);
            console.log(
            JSON.stringify(data, null, 2)
            );*/


                if (!error) {
                    setScreens(data ?? []);
                }


                setLoading(false);
            }
        );


    }, []);



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
            Lokalizacja: {screen.location}
        </p>

        <div
            style={{
                width: "640px",
                marginBottom: "20px"
            }}
        >
            <iframe
                src={`http://localhost:5174/?screenId=${screen.id}`}
                title={`Podgląd ekranu ${screen.name}`}
                style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    border: "1px solid #ccc",
                    borderRadius: "8px"
                }}
            />
        </div>

        {screen.screenPlaylists.length > 0 && (
            <div>
                <h4>Playlisty:</h4>

                {screen.screenPlaylists.map(item => (
                    <p key={item.id}>
                        Playlist ID: {item.playlistId}
                        <br />
                        Priorytet: {item.priority}
                    </p>
                ))}
            </div>
        )}

        <button
            onClick={() => onEdit(screen.id)}
        >
            Edytuj
        </button>
    </div>
))}
        </div>

    );

}