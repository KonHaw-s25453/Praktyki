-- Consolidated migration for the signage project
-- This single file contains the schema, cache/versioning support, screen_state, indexes,
-- triggers and a stored procedure to generate per-screen cache manifests.
-- Idempotent: drops objects before creating them and uses IF NOT EXISTS where practical.

SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if exist (order matters because of FKs)
DROP TABLE IF EXISTS cache_manifests;
DROP TABLE IF EXISTS screen_state;
DROP TABLE IF EXISTS screen_logs;
DROP TABLE IF EXISTS screen_playlists;
DROP TABLE IF EXISTS playlist_items;
DROP TABLE IF EXISTS playlists;
DROP TABLE IF EXISTS screens;
DROP TABLE IF EXISTS files;

SET FOREIGN_KEY_CHECKS = 1;

-- 1) files
CREATE TABLE files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,  -- image/* lub video/*
    duration INT NULL,                -- tylko dla wideo (opcjonalnie)
    size INT,
    checksum VARCHAR(128) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2) screens
CREATE TABLE screens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    api_key VARCHAR(255) UNIQUE,
    fallback_file_id INT NULL,
    last_seen TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) playlists
CREATE TABLE playlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    revision INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4) playlist_items
CREATE TABLE playlist_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    playlist_id INT NOT NULL,
    file_id INT NOT NULL,
    position INT NOT NULL,
    duration INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5) screen_playlists (assignment)
CREATE TABLE screen_playlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    screen_id INT NOT NULL,
    playlist_id INT NOT NULL,
    priority INT DEFAULT 1,
    active_from DATETIME NULL,
    active_to DATETIME NULL,
    revision INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (screen_id) REFERENCES screens(id) ON DELETE CASCADE,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6) screen_logs
CREATE TABLE screen_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    screen_id INT,
    message TEXT,
    level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (screen_id) REFERENCES screens(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7) cache_manifests (precomputed per-screen manifest JSON)
CREATE TABLE cache_manifests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    screen_id INT NOT NULL,
    revision INT NOT NULL,
    manifest JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (screen_id) REFERENCES screens(id) ON DELETE CASCADE,
    UNIQUE KEY uk_cache_manifests_screen_id (screen_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8) screen_state (runtime state for resuming playback)
CREATE TABLE screen_state (
    screen_id INT PRIMARY KEY,
    last_sync TIMESTAMP NULL,
    last_playlist_hash VARCHAR(255) NULL,
    current_playlist_id INT NULL,
    current_index INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (screen_id) REFERENCES screens(id) ON DELETE CASCADE,
    FOREIGN KEY (current_playlist_id) REFERENCES playlists(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9) Indexes
CREATE INDEX idx_sp_screen_time_prio ON screen_playlists(screen_id, active_from, active_to, priority);
CREATE INDEX idx_pi_playlist_pos ON playlist_items(playlist_id, position);
CREATE INDEX idx_files_checksum ON files(checksum(64));
CREATE INDEX idx_playlists_revision ON playlists(revision);
CREATE INDEX idx_screens_api_key_full ON screens(api_key(255));
CREATE INDEX idx_playlist_items_playlist ON playlist_items(playlist_id);
CREATE INDEX idx_screens_fallback_file ON screens(fallback_file_id);

-- Add FK constraint for fallback_file_id
ALTER TABLE screens ADD CONSTRAINT fk_screens_fallback_file FOREIGN KEY (fallback_file_id) REFERENCES files(id) ON DELETE SET NULL;

-- 10) Triggers: maintain revisions
-- Drop triggers if exist
DROP TRIGGER IF EXISTS trg_playlists_before_update;
DROP TRIGGER IF EXISTS trg_playlists_before_insert;
DROP TRIGGER IF EXISTS trg_playlist_items_after_insert;
DROP TRIGGER IF EXISTS trg_playlist_items_after_update;
DROP TRIGGER IF EXISTS trg_playlist_items_after_delete;
DROP TRIGGER IF EXISTS trg_screen_playlists_before_update;
DROP TRIGGER IF EXISTS trg_screen_playlists_before_insert;

DELIMITER $$
CREATE TRIGGER trg_playlists_before_update
BEFORE UPDATE ON playlists
FOR EACH ROW
BEGIN
  IF (OLD.revision IS NULL) THEN
    SET NEW.revision = 1;
  ELSE
    SET NEW.revision = OLD.revision + 1;
  END IF;
END$$

CREATE TRIGGER trg_playlists_before_insert
BEFORE INSERT ON playlists
FOR EACH ROW
BEGIN
  IF (NEW.revision IS NULL) THEN
    SET NEW.revision = 1;
  END IF;
END$$

CREATE TRIGGER trg_playlist_items_after_insert
AFTER INSERT ON playlist_items
FOR EACH ROW
BEGIN
  UPDATE playlists SET revision = revision + 1 WHERE id = NEW.playlist_id;
END$$

CREATE TRIGGER trg_playlist_items_after_update
AFTER UPDATE ON playlist_items
FOR EACH ROW
BEGIN
  IF NEW.playlist_id <> OLD.playlist_id THEN
    UPDATE playlists SET revision = revision + 1 WHERE id IN (OLD.playlist_id, NEW.playlist_id);
  ELSE
    UPDATE playlists SET revision = revision + 1 WHERE id = NEW.playlist_id;
  END IF;
END$$

CREATE TRIGGER trg_playlist_items_after_delete
AFTER DELETE ON playlist_items
FOR EACH ROW
BEGIN
  UPDATE playlists SET revision = revision + 1 WHERE id = OLD.playlist_id;
END$$

CREATE TRIGGER trg_screen_playlists_before_update
BEFORE UPDATE ON screen_playlists
FOR EACH ROW
BEGIN
  IF (OLD.revision IS NULL) THEN
    SET NEW.revision = 1;
  ELSE
    SET NEW.revision = OLD.revision + 1;
  END IF;
END$$

CREATE TRIGGER trg_screen_playlists_before_insert
BEFORE INSERT ON screen_playlists
FOR EACH ROW
BEGIN
  IF (NEW.revision IS NULL) THEN
    SET NEW.revision = 1;
  END IF;
END$$

DELIMITER ;

-- 11) Stored procedure to regenerate per-screen cache manifest
DROP PROCEDURE IF EXISTS regenerate_cache_manifest;
DELIMITER $$
CREATE PROCEDURE regenerate_cache_manifest(IN p_screen_id INT)
BEGIN
  DECLARE manifest_rev INT DEFAULT 0;

  SELECT GREATEST(
    COALESCE((SELECT MAX(revision) FROM screen_playlists sp WHERE sp.screen_id = p_screen_id), 0),
    COALESCE((SELECT MAX(p.revision) FROM playlists p JOIN screen_playlists sp2 ON p.id = sp2.playlist_id WHERE sp2.screen_id = p_screen_id), 0)
  ) INTO manifest_rev;

  SET @manifest = (
    SELECT JSON_OBJECT(
      'revision', manifest_rev,
      'assigned_playlists', IFNULL((
        SELECT JSON_ARRAYAGG(JSON_OBJECT('playlist_id', sp.playlist_id, 'priority', sp.priority, 'active_from', sp.active_from, 'active_to', sp.active_to))
        FROM screen_playlists sp
        WHERE sp.screen_id = p_screen_id
          AND (sp.active_from IS NULL OR sp.active_from <= NOW())
          AND (sp.active_to IS NULL OR sp.active_to >= NOW())
      ), JSON_ARRAY()),
      'playlists', IFNULL((
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', p.id,
            'name', p.name,
            'revision', p.revision,
            'items', (
              SELECT IFNULL(JSON_ARRAYAGG(JSON_OBJECT('position', pi.position, 'duration', pi.duration, 'file', JSON_OBJECT('id', f.id, 'filename', f.filename, 'path', f.path, 'mime_type', f.mime_type, 'size', f.size, 'checksum', f.checksum))), JSON_ARRAY())
              FROM playlist_items pi JOIN files f ON f.id = pi.file_id
              WHERE pi.playlist_id = p.id
              ORDER BY pi.position
            )
          )
        ORDER BY NULL
        )
        FROM playlists p JOIN screen_playlists sp ON p.id = sp.playlist_id
        WHERE sp.screen_id = p_screen_id
          AND (sp.active_from IS NULL OR sp.active_from <= NOW())
          AND (sp.active_to IS NULL OR sp.active_to >= NOW())
        ORDER BY sp.priority DESC, p.id
      ), JSON_ARRAY())
    )
    FROM dual
  );

  INSERT INTO cache_manifests (screen_id, revision, manifest)
  VALUES (p_screen_id, manifest_rev, CAST(@manifest AS JSON))
  ON DUPLICATE KEY UPDATE revision = VALUES(revision), manifest = VALUES(manifest), created_at = CURRENT_TIMESTAMP;
END$$
DELIMITER ;

-- Done
