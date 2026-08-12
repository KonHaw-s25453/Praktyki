const DB_NAME = "digital-signage-player";
const DB_VERSION = 1;

const FILE_STORE = "files";
const MANIFEST_STORE = "manifest";

interface CachedManifest {
  key: "active";
  data: unknown;
}

interface CachedFile {
  id: number;
  filename: string;
  mimeType: string;
  size: number;
  checksum: string;
  blob: Blob;
}
interface ManifestFile {
  id: number;
  filename: string;
  path: string;
  mimeType: string;
  size: number;
  checksum: string;
}

interface ManifestPlaylistItem {
  file: ManifestFile;
}

interface ManifestPlaylist {
  items: ManifestPlaylistItem[];
}

interface PlayerManifest {
  manifest: {
    playlists: ManifestPlaylist[];
    fallback: ManifestFile | null;
  };
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(FILE_STORE)) {
        db.createObjectStore(FILE_STORE, {
          keyPath: "id",
        });
      }

      if (!db.objectStoreNames.contains(MANIFEST_STORE)) {
        db.createObjectStore(MANIFEST_STORE, {
          keyPath: "key",
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

function getFilesFromManifest(
  manifest: PlayerManifest,
): ManifestFile[] {
  const files = new Map<number, ManifestFile>();

  for (const playlist of manifest.manifest.playlists) {
    for (const item of playlist.items) {
      files.set(item.file.id, item.file);
    }
  }

  const fallback = manifest.manifest.fallback;

  if (fallback) {
    files.set(fallback.id, fallback);
  }

  return Array.from(files.values());
}

export async function getCachedFileUrl(
  id: number,
): Promise<string | null> {
  const cached = await getCachedFile(id);

  if (!cached) {
    return null;
  }

  return URL.createObjectURL(cached.blob);
}

export async function getCachedFile(
  id: number,
): Promise<CachedFile | null> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(FILE_STORE, "readonly");
    const store = transaction.objectStore(FILE_STORE);

    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result ?? null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getCachedFiles(): Promise<CachedFile[]> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(FILE_STORE, "readonly");
    const store = transaction.objectStore(FILE_STORE);

    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result as CachedFile[]);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getCacheInfo() {
  const files = await getCachedFiles();

  const used = files.reduce(
    (total, file) => total + file.blob.size,
    0
  );

  let quota: number | null = null;
  let available: number | null = null;

  if (navigator.storage?.estimate) {
    const estimate = await navigator.storage.estimate();

    quota = estimate.quota ?? null;

    if (quota !== null) {
      available = Math.max(quota - used, 0);
    }
  }

  return { used, quota, available };
}

export interface CacheComparison {
  required: ManifestFile[];
  cached: CachedFile[];
  missing: ManifestFile[];
}

export async function compareManifestWithCache(
  manifest: PlayerManifest,
): Promise<CacheComparison> {
  const required = getFilesFromManifest(manifest);
  const cachedFiles = await getCachedFiles();

  const cachedIds = new Set(
    cachedFiles.map((file) => file.id),
  );

  const missing = required.filter(
    (file) => !cachedIds.has(file.id),
  );

  const cached = cachedFiles.filter(
    (file) => required.some(
      (requiredFile) => requiredFile.id === file.id,
    ),
  );

  return {
    required,
    cached,
    missing,
  };
}

export function canFitMissingFiles(
  missing: ManifestFile[],
  available: number,
): boolean {
  const requiredSpace = missing.reduce(
    (total, file) => total + file.size,
    0,
  );

  console.log("MISSING FILES SIZE:", requiredSpace);
  console.log("AVAILABLE STORAGE:", available);
  console.log(
    "ENOUGH STORAGE:",
    requiredSpace <= available,
  );

  return requiredSpace <= available;
}

export async function saveCachedFile(
  file: CachedFile,
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(FILE_STORE, "readwrite");
    const store = transaction.objectStore(FILE_STORE);

    store.put(file);

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
}

export async function getCachedManifest(): Promise<unknown | null> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      MANIFEST_STORE,
      "readonly",
    );

    const store = transaction.objectStore(MANIFEST_STORE);
    const request = store.get("active");

    request.onsuccess = () => {
      const result = request.result as CachedManifest | undefined;
      resolve(result?.data ?? null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveCachedManifest(
  manifest: unknown,
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      MANIFEST_STORE,
      "readwrite",
    );

    const store = transaction.objectStore(MANIFEST_STORE);

    store.put({
      key: "active",
      data: manifest,
    });

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
}

export async function syncManifest(
  manifest: PlayerManifest,
): Promise<void> {
  const files = getFilesFromManifest(manifest);

  console.log(
    "CACHE SYNC: files required:",
    files.map((file) => file.id),
  );

  for (const file of files) {
    const cached = await getCachedFile(file.id);

    if (cached) {
      console.log(
        `CACHE HIT: ${file.id} ${file.filename}`,
      );

      continue;
    }

    console.log(
      `CACHE MISS: ${file.id} ${file.filename}`,
    );

    const response = await fetch(
      `http://localhost:3000/assets/${file.filename}`,
    );

    if (!response.ok) {
      throw new Error(
        `Cannot download file ${file.filename}: ${response.status}`,
      );
    }

    const blob = await response.blob();

    await saveCachedFile({
      id: file.id,
      filename: file.filename,
      mimeType: file.mimeType,
      size: file.size,
      checksum: file.checksum,
      blob,
    });

    console.log(
      `CACHE SAVED: ${file.id} ${file.filename}`,
    );
  }

  console.log("CACHE SYNC: all files available");

  await saveCachedManifest(manifest);

  console.log("CACHE SYNC: manifest saved");
}