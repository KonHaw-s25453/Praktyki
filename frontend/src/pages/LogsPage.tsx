import { useEffect, useState } from "react";

interface ScreenLog {
  id: number;
  message: string | null;
  level: string | null;
  createdAt: string;
  screenId: number;
}

interface Screen {
  id: number;
  name: string;
}

export default function LogsPage() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [selectedScreenId, setSelectedScreenId] = useState<number | null>(null);
  const [logs, setLogs] = useState<ScreenLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadScreens = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(
          `${API_URL}/screens`,
        );

        if (!response.ok) {
          throw new Error(
            `Cannot load screens: ${response.status}`,
          );
        }

        const data: Screen[] = await response.json();

        setScreens(data);

        if (data.length > 0) {
          setSelectedScreenId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load screens:", err);
        setError("Nie udało się pobrać ekranów.");
      }
    };

    loadScreens();
  }, []);

  useEffect(() => {
  if (selectedScreenId === null) {
    return;
  }

  const loadLogs = async () => {
    setLoading(true);
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${API_URL}/sync/${selectedScreenId}/logs`,
      );

      if (!response.ok) {
        throw new Error(
          `Cannot load logs: ${response.status}`,
        );
      }

      const data: ScreenLog[] = await response.json();

      setLogs(data);
    } catch (err) {
      console.error("Failed to load logs:", err);
      setError("Nie udało się pobrać logów.");
    } finally {
      setLoading(false);
    }
  };

  loadLogs();

  const interval = setInterval(loadLogs, 5000);

  return () => {
    clearInterval(interval);
  };
}, [selectedScreenId]);

const getLogClass = (log: ScreenLog) => {
  switch (log.level?.toUpperCase()) {
    case "ERROR":
      return "log-error";

    case "WARN":
      return "log-warn";

    case "INFO":
    case "PLAYBACK":
      return "log-info";

    default:
      return "";
  }
};

  return (
    <div className="page logs-page">

        <header className="page-header">
            <div>
                <h1>Logi ekranów</h1>
                <p className="page-description">
                    Historia zdarzeń zgłaszanych przez ekrany.
                </p>
            </div>
        </header>

        <section className="page-section logs-controls">
            <label>
                Ekran:{" "}
                <select
                    value={selectedScreenId ?? ""}
                    onChange={(event) =>
                        setSelectedScreenId(Number(event.target.value))
                    }
                >
                    {screens.map((screen) => (
                        <option key={screen.id} value={screen.id}>
                            {screen.name}
                        </option>
                    ))}
                </select>
            </label>
        </section>

        {loading && <p>Ładowanie logów...</p>}

        {error && (
            <p className="logs-error">
                {error}
            </p>
        )}

        {!loading && !error && (
            logs.length === 0 ? (
                <p>Brak logów dla tego ekranu.</p>
            ) : (
                <section className="page-section logs-table-section">
                    <div className="logs-table-wrapper">
                        <table className="logs-table">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Poziom</th>
                                    <th>Zdarzenie</th>
                                </tr>
                            </thead>

                            <tbody>
                                {logs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className={getLogClass(log)}
                                    >
                                        <td>
                                            {new Date(
                                                log.createdAt
                                            ).toLocaleString()}
                                        </td>

                                        <td>
                                            {log.level}
                                        </td>

                                        <td>
                                            {log.message}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )
        )}
    </div>
);
}