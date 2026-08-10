import { useEffect, useState } from "react";

interface PlaylistItem {
  position: number;
  duration: number;
  videoLoops: number;
  file: {
    filename: string;
    mimeType: string;
  };
}

interface Playlist {
  id: number;
  name: string;
  items: PlaylistItem[];
}
interface ManifestResponse {
  revision: number;
  manifest: {
    screenId: number;
    timestamp: string;
    playlists: Playlist[];
    fallback: {
      id: number;
      filename: string;
      path: string;
      mimeType: string;
      size: number;
      checksum: string;
    };
  };
  status: string;
}
export default function Player() {


  const [manifest, setManifest] = useState<ManifestResponse | null>(null);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const params = new URLSearchParams(window.location.search);
  const screenId = params.get("screenId");

  useEffect(() => {
    console.log("SCREEN ID:", screenId, typeof screenId);

    fetch("http://localhost:3000/sync/manifest", {
      headers: {
        "X-Screen-ID": String(screenId),
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          console.error("MANIFEST ERROR:", response.status, errorText);
          throw new Error(`Cannot load manifest: ${response.status}`);
}

        return response.json();
      })
      .then((data: ManifestResponse) => {
        console.log("MANIFEST:", data);
        setManifest(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [screenId]);

  useEffect(() => {
    if (!screenId) {
        return;
    }

    const playerUrl = window.location.origin;

    const sendHeartbeat = async () => {
    try {
        const response = await fetch(
            `http://localhost:3000/sync/${screenId}/heartbeat`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    playerUrl,
                }),
            },
        );

        const text = await response.text();

        console.log("HEARTBEAT RESPONSE:", {
            status: response.status,
            body: text,
        });
    } catch (err) {
        console.error("Heartbeat error:", err);
    }
};

    sendHeartbeat();

    console.log("HEARTBEAT:", {
    screenId,
    playerUrl,
});

    const interval = setInterval(
        sendHeartbeat,
        30_000,
    );
    
    return () => {
        clearInterval(interval);
    };
}, [screenId]);

 useEffect(() => {
  if (!screenId || !manifest) {
    return;
  }

  const checkForChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/sync/${screenId}/check?currentRevision=${manifest.revision}`,
      );

      if (!response.ok) {
        console.error(
          "CHECK ERROR:",
          response.status,
          await response.text(),
        );
        return;
      }

      const data = await response.json();

      console.log("MANIFEST CHECK:", data);

      if (data.changed) {
        console.log("MANIFEST CHANGED - loading new manifest");

        const manifestResponse = await fetch(
          "http://localhost:3000/sync/manifest",
          {
            headers: {
              "X-Screen-ID": String(screenId),
            },
          },
        );

        if (!manifestResponse.ok) {
          throw new Error(
            `Cannot reload manifest: ${manifestResponse.status}`,
          );
        }

        const newManifest: ManifestResponse =
          await manifestResponse.json();

        console.log("NEW MANIFEST:", newManifest);

        setManifest(newManifest);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error("Manifest check error:", err);
    }
  };

  const interval = setInterval(checkForChanges, 10_000);

  return () => {
    clearInterval(interval);
  };
}, [screenId, manifest]);

  if (error) {
    return <h1>{error}</h1>;
  }

  if (!manifest) {
  return <div>Loading...</div>;
  }

if (manifest.manifest.playlists.length === 0) {
    const fallback = manifest.manifest.fallback;

    if (!fallback) {
        return <p>Brak playlisty i fallbacku</p>;
    }

    return (
        <div className="player">
            {fallback.mimeType.startsWith("video/") ? (
                <video
                    src={`http://localhost:3000/assets/${fallback.filename}`}
                    autoPlay
                    muted
                    playsInline
                    loop
                />
            ) : (
                <img
                    src={`http://localhost:3000/assets/${fallback.filename}`}
                    alt="Fallback"
                />
            )}
        </div>
    );
}

  const playlist = manifest.manifest.playlists[0];
  const item = playlist.items[currentIndex];
  const file = item.file;

 console.log("PLAYLIST:", playlist);
 console.log("CURRENT ITEM:", item);
 console.log("CURRENT FILE:", file);

  const next = () => {
  setCurrentIndex((prev) =>
    prev + 1 >= playlist.items.length ? 0 : prev + 1
    );
  };
return (
  <div className="player">
    {file.mimeType.startsWith("video/") ? (
      <video
        src={`http://localhost:3000/assets/${file.filename}`}
        autoPlay
        muted
        playsInline
      // controls
        onEnded={next}
      />
    ) : (
      <img
        src={`http://localhost:3000/assets/${file.filename}`}
        alt=""
        onLoad={() => {
          setTimeout(next, item.duration * 1000);
        }}
      />
    )}
  </div>
);
}