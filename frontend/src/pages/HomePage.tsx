type HomePageProps = {
    onNavigate: (
        page: "home" | "files" | "playlists" | "screens" | "logs"
    ) => void;
};

export default function HomePage({ onNavigate }: HomePageProps) {
    return (
        <main className="home-page">
            <section className="home-hero">
                <h1>Digital Signage CMS</h1>

                <p>
                    System zarządzania ekranami informacyjnymi
                </p>
            </section>

            <section className="home-cards">
                <button
                    className="home-card"
                    onClick={() => onNavigate("screens")}
                >
                    <span className="home-card-title">
                        Ekrany
                    </span>

                    <span className="home-card-description">
                        Zarządzaj ekranami i przypisanymi playlistami.
                    </span>
                </button>

                <button
                    className="home-card"
                    onClick={() => onNavigate("playlists")}
                >
                    <span className="home-card-title">
                        Playlisty
                    </span>

                    <span className="home-card-description">
                        Twórz i edytuj playlisty wyświetlane na ekranach.
                    </span>
                </button>

                <button
                    className="home-card"
                    onClick={() => onNavigate("files")}
                >
                    <span className="home-card-title">
                        Biblioteka plików
                    </span>

                    <span className="home-card-description">
                        Zarządzaj plikami wykorzystywanymi przez system.
                    </span>
                </button>

                <button
                    className="home-card"
                    onClick={() => onNavigate("logs")}
                >
                    <span className="home-card-title">
                        Logi
                    </span>

                    <span className="home-card-description">
                        Przeglądaj logi działania systemu.
                    </span>
                </button>
            </section>
        </main>
    );
}