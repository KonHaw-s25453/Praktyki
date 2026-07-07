-- @dialect mysql
-- Queries for SYNC endpoint
-- These queries are used by the server to respond to screen sync requests.
-- Reference: /Plan describes the SYNC step where screens ask "czy coś się zmieniło?"

-- 1) GET MANIFEST FOR SCREEN (full playlist + files)
-- Used on initial SYNC or when revision changed.
-- Returns: JSON manifest with revision, playlists, files.
SELECT 
    cm.revision,
    cm.manifest
FROM cache_manifests cm
WHERE cm.screen_id = ?;

-- Alternative if cache_manifests not yet populated:
-- Call procedure to regenerate:
-- CALL regenerate_cache_manifest(?);
-- SELECT manifest FROM cache_manifests WHERE screen_id = ?;


-- 2) CHECK IF SCREEN MANIFEST CHANGED (lightweight)
-- Used by screen to poll: "czy manifest się zmienił?"
-- Returns: current revision so screen can compare with its last_playlist_hash.
SELECT 
    GREATEST(
        COALESCE((SELECT MAX(sp.revision) FROM screen_playlists sp WHERE sp.screen_id = ?), 0),
        COALESCE((SELECT MAX(p.revision) FROM playlists p JOIN screen_playlists sp2 ON p.id = sp2.playlist_id WHERE sp2.screen_id = ?), 0)
    ) AS manifest_revision,
    (SELECT cm.created_at FROM cache_manifests cm WHERE cm.screen_id = ? LIMIT 1) AS cache_updated_at;


-- 3) GET FALLBACK ASSET FOR SCREEN
-- Used when screen enters FALLBACK mode (no internet).
-- Returns: fallback video/logo file path and metadata.
SELECT 
    s.id AS screen_id,
    f.id AS file_id,
    f.filename,
    f.path,
    f.mime_type,
    f.duration,
    f.size,
    f.checksum
FROM screens s
LEFT JOIN files f ON f.id = s.fallback_file_id
WHERE s.id = ?;


-- 4) GET FULL SYNC RESPONSE (used in application code)
-- Returns: manifest revision, manifest JSON, fallback file, and screen state.
SELECT 
    (SELECT GREATEST(
        COALESCE((SELECT MAX(sp.revision) FROM screen_playlists sp WHERE sp.screen_id = ?), 0),
        COALESCE((SELECT MAX(p.revision) FROM playlists p JOIN screen_playlists sp2 ON p.id = sp2.playlist_id WHERE sp2.screen_id = ?), 0)
    )) AS manifest_revision,
    (SELECT cm.manifest FROM cache_manifests cm WHERE cm.screen_id = ? LIMIT 1) AS manifest,
    (SELECT JSON_OBJECT(
        'file_id', f.id,
        'filename', f.filename,
        'path', f.path,
        'mime_type', f.mime_type,
        'duration', f.duration,
        'size', f.size,
        'checksum', f.checksum
    ) FROM screens s LEFT JOIN files f ON f.id = s.fallback_file_id WHERE s.id = ?) AS fallback_asset,
    (SELECT JSON_OBJECT(
        'last_sync', ss.last_sync,
        'current_playlist_id', ss.current_playlist_id,
        'current_index', ss.current_index
    ) FROM screen_state ss WHERE ss.screen_id = ?) AS screen_state;


-- 5) UPDATE SCREEN LAST_SEEN (heartbeat)
-- Called when screen contacts server (any endpoint).
UPDATE screens 
SET last_seen = NOW() 
WHERE id = ?;


-- 6) UPDATE SCREEN_STATE (ekran zapisuje gdzie był)
-- Called periodically by screen or at key points (playlist change, playback position).
INSERT INTO screen_state (screen_id, last_sync, last_playlist_hash, current_playlist_id, current_index, updated_at)
VALUES (?, NOW(), ?, ?, ?, NOW())
ON DUPLICATE KEY UPDATE 
    last_sync = VALUES(last_sync),
    last_playlist_hash = VALUES(last_playlist_hash),
    current_playlist_id = VALUES(current_playlist_id),
    current_index = VALUES(current_index),
    updated_at = NOW();


-- 7) REGENERATE CACHE MANIFEST FOR SCREEN
-- Call this when playlists/screen_playlists change (or periodically).
CALL regenerate_cache_manifest(?);


-- FLOW MAPPING (z Plan dokumentu):
-- START/INIT (PLAY)        → queries 1, 3, 4 (get manifest + fallback + state)
-- END OF PLAYLIST (SYNC)   → queries 2, 4, 7 (check revision, regenerate if needed, return full sync response)
-- FALLBACK (RETRY)         → queries 3, 4 (get fallback asset, retry sync)
-- HEARTBEAT                → query 5 (update last_seen)
-- PLAYBACK STATE UPDATE    → query 6 (update screen_state with current position)
