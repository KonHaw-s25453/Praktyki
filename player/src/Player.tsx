import { useEffect, useState } from "react";


interface ManifestResponse {
  revision: number;
  manifest: {
    screenId: number;
    timestamp: string;
    playlists: unknown[];
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

  useEffect(() => {
    fetch("http://localhost:3000/sync/manifest", {
      headers: {
        "X-Screen-ID": "1",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Cannot load manifest");
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
  }, []);

  if (error) {
    return <h1>{error}</h1>;
  }

  if (!manifest) {
    return <h1>Loading...</h1>;
  }

  const fallback = manifest.manifest.fallback;

  return (
   <div className="player">
    <img
    src={`http://localhost:3000/assets/${fallback.filename}`}
    alt="Fallback"
    />
  </div>
  );
}