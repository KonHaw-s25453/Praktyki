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
        const response = await fetch(
          "http://localhost:3000/screens",
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
        const response = await fetch(
          `http://localhost:3000/sync/${selectedScreenId}/logs`,
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
  }, [selectedScreenId]);

  return (
    <div>
      <h1>Logi ekranów</h1>

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

      {loading && <p>Ładowanie logów...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Poziom</th>
              <th>Zdarzenie</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>
                  {new Date(log.createdAt).toLocaleString()}
                </td>

                <td>{log.level}</td>

                <td>{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}