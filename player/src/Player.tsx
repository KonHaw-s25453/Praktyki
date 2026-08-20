import { useCallback, useEffect, useState } from "react";
import {
  getCachedFileUrl, 
  getCachedManifest, 
  getCachedFiles, 
  getCacheInfo, 
  syncManifest, 
  compareManifestWithCache, 
  canFitMissingFiles
        } from "./cache";

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
  const [fallbackReason, setFallbackReason] = useState<
  "NORMAL" | "ERROR" | null
>(null);

const logEvent = useCallback(
  async (
    message: string,
    level: "INFO" | "ERROR" | "PLAYBACK" |"WARN" = "INFO",
  ) => {
    if (!screenId) {
      console.warn("Cannot send log: missing screenId");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${API_URL}/sync/${screenId}/logs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            level,
          }),
        },
      );

      const text = await response.text();

      console.log("LOG RESPONSE:", {
        status: response.status,
        body: text,
      });
    } catch (err) {
      console.error("Failed to send player log:", err);
    }
  },
  [screenId],
);

  useEffect(() => {
  if (!screenId) {
    return;
  }

const loadManifest = async () => {
  try {
    console.log("SCREEN ID:", screenId, typeof screenId);

    const cachedFiles = await getCachedFiles();
    console.log("ALL CACHED FILES:", cachedFiles);

    const cacheInfo = await getCacheInfo();
    console.log("CACHE INFO:", cacheInfo);

    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(
      `${API_URL}/sync/manifest`,
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

    await logEvent(
    `MANIFEST_LOADED revision=${data.revision}`,
  );
    console.log("MANIFEST FROM BACKEND:", data);

    const comparison = await compareManifestWithCache(data);

    console.log("MANIFEST VS CACHE:", comparison);
    console.log("REQUIRED FILES:", comparison.required);
    console.log("CACHED FILES:", comparison.cached);
    console.log("MISSING FILES:", comparison.missing);

  
    const canFit = canFitMissingFiles(
      comparison.missing,
      cacheInfo.available ?? 0,
    );


    console.log("CAN FIT MISSING FILES:", canFit);

    if (!canFit) {
      await logEvent(
    `CACHE_FULL available=${cacheInfo.available ?? 0}`,
    "WARN",
    );

      console.warn(
        "Brak miejsca na nowy manifest — próbuję użyć starego manifestu.",
      );

      const cachedManifest = await getCachedManifest();

      if (cachedManifest) {
        console.log(
          "USING OLD CACHED MANIFEST:",
          cachedManifest,
        );

        setManifest(cachedManifest as ManifestResponse);
        setCurrentIndex(0);
        setError("");

        return;
      }

      console.warn(
        "Brak starego manifestu — używam fallbacku.",
      );

      const fallback = data.manifest.fallback;

      if (fallback) {
        setFallbackReason("ERROR");
        setManifest({
          ...data,
          manifest: {
            ...data.manifest,
            playlists: [],
          },
        });

        setCurrentIndex(0);
        setError("");

        return;
      }

      setError(
        "Brak wystarczającego miejsca w pamięci podręcznej i brak fallbacku.",
      );

      return;
    }

    // Wszystko jest OK — synchronizujemy nowy manifest
    await logEvent(
  `SYNC_STARTED revision=${data.revision}`,
    );
    await syncManifest(data);
    await logEvent(
  `SYNC_COMPLETED revision=${data.revision}`,
    );

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
}, [screenId, logEvent]);

  useEffect(() => {
    if (!screenId) {
        return;
    }

    const playerUrl = window.location.origin;

    const sendHeartbeat = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(
            `${API_URL}/sync/${screenId}/heartbeat`,
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
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${API_URL}/sync/${screenId}/check?currentRevision=${manifest.revision}`,
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

        const API_URL = import.meta.env.VITE_API_URL;
        const manifestResponse = await fetch(
          `${API_URL}/sync/manifest`,
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
      await logEvent(
        `ITEM_STARTED file=${item.file.filename}`,
      );

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

      await logEvent(
  `CACHE_PLAYBACK_ERROR file=${item.file.filename} error=${
    err instanceof Error ? err.message : String(err)
  }`,
  "ERROR",
      );

      const fallback = manifest.manifest.fallback;

      if (fallback) {
  console.warn(
    "Plik nie jest w cache — używam fallbacku.",
  );

  await logEvent(
    `CACHE_MISS_USING_FALLBACK file=${item.file.filename}`,
    "WARN",
  );

  setFallbackReason("ERROR");

  setCurrentFileUrl(null);

  try {
    const fallbackUrl = await getCachedFileUrl(fallback.id);

   if (!fallbackUrl) {
  console.error(
    `Fallback file ${fallback.id} is not available in cache`,
  );

  setError(
    `Fallback file ${fallback.id} is not available in cache`,
  );

  return;
}

    setCurrentFileUrl(fallbackUrl);
  } catch (fallbackError) {
    console.error(
      "Fallback cache error:",
      fallbackError,
    );

    setError(
      fallbackError instanceof Error
        ? fallbackError.message
        : "Fallback is not available in cache",
    );

    return;
  }

  setManifest({
    ...manifest,
    manifest: {
      ...manifest.manifest,
      playlists: [],
    },
  });

  setCurrentIndex(0);
  setError("");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Cannot load cached file",
        );
      }
    }
  };

  loadCachedFile();

 /* return () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }; */

}, [manifest, currentIndex,logEvent]);


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
          src={currentFileUrl ?? undefined}
          autoPlay
          muted
          playsInline
          loop
        />
      ) : (
        <img
          src={currentFileUrl ?? undefined}
          alt="Fallback"
        />
      )}

      {fallbackReason === "ERROR" && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: "60px",
            height: "12px",
            backgroundColor: "crimson",
            zIndex: 9999,
          }}
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
        onError={() => {
          logEvent(
            `VIDEO_PLAYBACK_ERROR file=${file.filename}`,
            "ERROR",
    );
  }}
      />
    ) : (
      <img
        src={currentFileUrl ?? undefined}
        alt=""
        onLoad={() => {
          setTimeout(next, item.duration * 1000);  
        }}
        onError={() => {
          logEvent(
            `IMAGE_PLAYBACK_ERROR file=${file.filename}`,
            "ERROR",
    );
  }}
      />
    )}
  </div>
);
}