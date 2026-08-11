import { useEffect, useState } from "react";
import {getCachedFileUrl, getCachedManifest, syncManifest,} from "./cache";

interface PlaylistFile {
  id: number;
  filename: string;
  path: string;
  mimeType: string;
  size: number;
  checksum: string;
}

interface PlaylistItem {
  position: number;
  duration: number;
  videoLoops: number;
  file: PlaylistFile;
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
    fallback: PlaylistFile | null;
  };
  status: string;
}
export default function Player() {


  const [manifest, setManifest] = useState<ManifestResponse | null>(null);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const params = new URLSearchParams(window.location.search);
  const screenId = params.get("screenId");
  const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null);

  useEffect(() => {
  if (!screenId) {
    return;
  }

  const loadManifest = async () => {
    try {
      console.log("SCREEN ID:", screenId, typeof screenId);

      const response = await fetch(
        "http://localhost:3000/sync/manifest",
        {
          headers: {
            "X-Screen-ID": String(screenId),
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Cannot load manifest: ${response.status}`,
        );
      }

      const data: ManifestResponse = await response.json();

      console.log("MANIFEST FROM BACKEND:", data);

      await syncManifest(data);

      console.log("CACHE READY");

      setManifest(data);
      setCurrentIndex(0);
      setError("");
    } catch (err) {
      console.error(
        "Backend unavailable, trying cached manifest...",
        err,
      );

      try {
        const cached = await getCachedManifest();

        if (!cached) {
          setError(
    "Backend niedostępny i brak zapisanej konfiguracji.",
                  );
                return;
                     }

        console.log("USING CACHED MANIFEST:", cached);

        setManifest(cached as ManifestResponse);
        setCurrentIndex(0);
        setError("");
      } catch (cacheError) {
        console.error("CACHE LOAD ERROR:", cacheError);

        setError(
          "Backend niedostępny i brak zapisanej konfiguracji.",
        );
      }
    }
  };

  loadManifest();
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

        await syncManifest(newManifest);

        console.log("CACHE READY FOR NEW MANIFEST");


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

useEffect(() => {
  if (!manifest) {
    return;
  }

  const playlist = manifest.manifest.playlists[0];

  if (!playlist) {
    return;
  }

  const item = playlist.items[currentIndex];

  if (!item) {
    return;
  }

  let objectUrl: string | null = null;

  const loadCachedFile = async () => {
    try {
      objectUrl = await getCachedFileUrl(item.file.id);

      if (!objectUrl) {
        throw new Error(
          `File ${item.file.id} is not available in cache`,
        );
      }

      console.log(
        "LOCAL FILE URL:",
        item.file.filename,
        objectUrl,
      );

      setCurrentFileUrl(objectUrl);
    } catch (err) {
      console.error("Cache playback error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Cannot load cached file",
      );
    }
  };

  loadCachedFile();

  return () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  };
}, [manifest, currentIndex]);


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
        src={currentFileUrl ?? undefined}
        autoPlay
        muted
        playsInline
      // controls
        onEnded={next}
      />
    ) : (
      <img
        src={currentFileUrl ?? undefined}
        alt=""
        onLoad={() => {
          setTimeout(next, item.duration * 1000);
        }}
      />
    )}
  </div>
);
}