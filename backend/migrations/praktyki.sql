-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Cze 20, 2026 at 08:54 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `praktyki`
--
CREATE DATABASE IF NOT EXISTS `praktyki` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `praktyki`;

DELIMITER $$
--
-- Procedury
--
DROP PROCEDURE IF EXISTS `regenerate_cache_manifest`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `regenerate_cache_manifest` (IN `p_screen_id` INT)   BEGIN
  DECLARE manifest_rev INT DEFAULT 0;
  DECLARE v_manifest JSON; -- Zmienna na przechowanie wygenerowanego JSON-a

  SELECT GREATEST(
    COALESCE((SELECT MAX(revision) FROM screen_playlists sp WHERE sp.screen_id = p_screen_id), 0),
    COALESCE((SELECT MAX(p.revision) FROM playlists p JOIN screen_playlists sp2 ON p.id = sp2.playlist_id WHERE sp2.screen_id = p_screen_id), 0)
  ) INTO manifest_rev;

  -- Zapisujemy wynik bezpośrednio do zadeklarowanej zmiennej lokalnej
  SET v_manifest = (
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

  -- Używamy czystego przypisania ze zmiennych lokalnych. 
  -- Ta składnia działa w KAŻDEJ wersji MySQL oraz MariaDB na świecie.
  INSERT INTO cache_manifests (screen_id, revision, manifest)
  VALUES (p_screen_id, manifest_rev, v_manifest)
  ON DUPLICATE KEY UPDATE 
    revision = manifest_rev, 
    manifest = v_manifest, 
    created_at = CURRENT_TIMESTAMP;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `cache_manifests`
--

DROP TABLE IF EXISTS `cache_manifests`;
CREATE TABLE `cache_manifests` (
  `id` int(11) NOT NULL,
  `screen_id` int(11) DEFAULT NULL,
  `revision` int(11) NOT NULL,
  `manifest` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`manifest`)),
  `screenId` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `files`
--

DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `path` varchar(500) NOT NULL,
  `duration` int(11) DEFAULT NULL,
  `size` int(11) NOT NULL,
  `checksum` varchar(128) DEFAULT NULL,
  `originalName` varchar(255) NOT NULL,
  `mimeType` varchar(100) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `playlists`
--

DROP TABLE IF EXISTS `playlists`;
CREATE TABLE `playlists` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `revision` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Wyzwalacze `playlists`
--
DROP TRIGGER IF EXISTS `trg_playlists_before_insert`;
DELIMITER $$
CREATE TRIGGER `trg_playlists_before_insert` BEFORE INSERT ON `playlists` FOR EACH ROW BEGIN
  IF (NEW.revision IS NULL) THEN
    SET NEW.revision = 1;
  END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_playlists_before_update`;
DELIMITER $$
CREATE TRIGGER `trg_playlists_before_update` BEFORE UPDATE ON `playlists` FOR EACH ROW BEGIN
  IF (OLD.revision IS NULL) THEN
    SET NEW.revision = 1;
  ELSE
    SET NEW.revision = OLD.revision + 1;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `playlist_items`
--

DROP TABLE IF EXISTS `playlist_items`;
CREATE TABLE `playlist_items` (
  `id` int(11) NOT NULL,
  `playlist_id` int(11) DEFAULT NULL,
  `file_id` int(11) DEFAULT NULL,
  `position` int(11) NOT NULL,
  `duration` int(11) NOT NULL DEFAULT 10,
  `playlistId` int(11) NOT NULL,
  `fileId` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Wyzwalacze `playlist_items`
--
DROP TRIGGER IF EXISTS `trg_playlist_items_after_delete`;
DELIMITER $$
CREATE TRIGGER `trg_playlist_items_after_delete` AFTER DELETE ON `playlist_items` FOR EACH ROW BEGIN
  UPDATE playlists SET revision = revision + 1 WHERE id = OLD.playlist_id;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_playlist_items_after_insert`;
DELIMITER $$
CREATE TRIGGER `trg_playlist_items_after_insert` AFTER INSERT ON `playlist_items` FOR EACH ROW BEGIN
  UPDATE playlists SET revision = revision + 1 WHERE id = NEW.playlist_id;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_playlist_items_after_update`;
DELIMITER $$
CREATE TRIGGER `trg_playlist_items_after_update` AFTER UPDATE ON `playlist_items` FOR EACH ROW BEGIN
  IF NEW.playlist_id <> OLD.playlist_id THEN
    UPDATE playlists SET revision = revision + 1 WHERE id IN (OLD.playlist_id, NEW.playlist_id);
  ELSE
    UPDATE playlists SET revision = revision + 1 WHERE id = NEW.playlist_id;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `screens`
--

DROP TABLE IF EXISTS `screens`;
CREATE TABLE `screens` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `fallback_file_id` int(11) DEFAULT NULL,
  `apiKey` varchar(255) DEFAULT NULL,
  `fallbackFileId` int(11) DEFAULT NULL,
  `lastSeen` timestamp NULL DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `screen_logs`
--

DROP TABLE IF EXISTS `screen_logs`;
CREATE TABLE `screen_logs` (
  `id` int(11) NOT NULL,
  `screen_id` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `level` varchar(50) DEFAULT NULL,
  `screenId` int(11) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `screen_playlists`
--

DROP TABLE IF EXISTS `screen_playlists`;
CREATE TABLE `screen_playlists` (
  `id` int(11) NOT NULL,
  `screen_id` int(11) DEFAULT NULL,
  `playlist_id` int(11) DEFAULT NULL,
  `priority` int(11) NOT NULL DEFAULT 1,
  `revision` int(11) NOT NULL DEFAULT 1,
  `screenId` int(11) NOT NULL,
  `playlistId` int(11) NOT NULL,
  `activeFrom` datetime DEFAULT NULL,
  `activeTo` datetime DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Wyzwalacze `screen_playlists`
--
DROP TRIGGER IF EXISTS `trg_screen_playlists_before_insert`;
DELIMITER $$
CREATE TRIGGER `trg_screen_playlists_before_insert` BEFORE INSERT ON `screen_playlists` FOR EACH ROW BEGIN
  IF (NEW.revision IS NULL) THEN
    SET NEW.revision = 1;
  END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_screen_playlists_before_update`;
DELIMITER $$
CREATE TRIGGER `trg_screen_playlists_before_update` BEFORE UPDATE ON `screen_playlists` FOR EACH ROW BEGIN
  IF (OLD.revision IS NULL) THEN
    SET NEW.revision = 1;
  ELSE
    SET NEW.revision = OLD.revision + 1;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `screen_state`
--

DROP TABLE IF EXISTS `screen_state`;
CREATE TABLE `screen_state` (
  `screen_id` int(11) NOT NULL,
  `current_playlist_id` int(11) DEFAULT NULL,
  `screenId` int(11) NOT NULL,
  `lastSync` timestamp NULL DEFAULT NULL,
  `lastPlaylistHash` varchar(255) DEFAULT NULL,
  `currentPlaylistId` int(11) DEFAULT NULL,
  `currentIndex` int(11) NOT NULL DEFAULT 0,
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `cache_manifests`
--
ALTER TABLE `cache_manifests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_fa44c0b0b3186f5af7faee0962` (`screenId`),
  ADD UNIQUE KEY `uk_cache_manifests_screen_id` (`screenId`),
  ADD KEY `FK_012196324b73310ad4719c7d53f` (`screen_id`);

--
-- Indeksy dla tabeli `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `playlists`
--
ALTER TABLE `playlists`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `playlist_items`
--
ALTER TABLE `playlist_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_1443ec83e270ecd8721a31cd319` (`playlist_id`),
  ADD KEY `FK_2acdad16361f5815d4bcc68c4bc` (`file_id`);

--
-- Indeksy dla tabeli `screens`
--
ALTER TABLE `screens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_93cc774e74b7e5534ffbaceebe` (`apiKey`),
  ADD UNIQUE KEY `IDX_f27b2516a9ace48ab87edb5bf4` (`fallback_file_id`),
  ADD UNIQUE KEY `REL_f27b2516a9ace48ab87edb5bf4` (`fallback_file_id`);

--
-- Indeksy dla tabeli `screen_logs`
--
ALTER TABLE `screen_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_f1721a91b87463a917723a90c48` (`screen_id`);

--
-- Indeksy dla tabeli `screen_playlists`
--
ALTER TABLE `screen_playlists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_aa2fa77c3d443b50451d43d6854` (`screen_id`),
  ADD KEY `FK_ce3a039d54b7e9352427d504fa2` (`playlist_id`);

--
-- Indeksy dla tabeli `screen_state`
--
ALTER TABLE `screen_state`
  ADD PRIMARY KEY (`screenId`),
  ADD UNIQUE KEY `IDX_734ec69c008826a12d9723734b` (`screen_id`),
  ADD UNIQUE KEY `REL_734ec69c008826a12d9723734b` (`screen_id`),
  ADD KEY `FK_d51b87b31d454ab871656f68149` (`current_playlist_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cache_manifests`
--
ALTER TABLE `cache_manifests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `playlists`
--
ALTER TABLE `playlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `playlist_items`
--
ALTER TABLE `playlist_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `screens`
--
ALTER TABLE `screens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `screen_logs`
--
ALTER TABLE `screen_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `screen_playlists`
--
ALTER TABLE `screen_playlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cache_manifests`
--
ALTER TABLE `cache_manifests`
  ADD CONSTRAINT `FK_012196324b73310ad4719c7d53f` FOREIGN KEY (`screen_id`) REFERENCES `screens` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `playlist_items`
--
ALTER TABLE `playlist_items`
  ADD CONSTRAINT `FK_1443ec83e270ecd8721a31cd319` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_2acdad16361f5815d4bcc68c4bc` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `screens`
--
ALTER TABLE `screens`
  ADD CONSTRAINT `FK_f27b2516a9ace48ab87edb5bf4e` FOREIGN KEY (`fallback_file_id`) REFERENCES `files` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `screen_logs`
--
ALTER TABLE `screen_logs`
  ADD CONSTRAINT `FK_f1721a91b87463a917723a90c48` FOREIGN KEY (`screen_id`) REFERENCES `screens` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Constraints for table `screen_playlists`
--
ALTER TABLE `screen_playlists`
  ADD CONSTRAINT `FK_aa2fa77c3d443b50451d43d6854` FOREIGN KEY (`screen_id`) REFERENCES `screens` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ce3a039d54b7e9352427d504fa2` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `screen_state`
--
ALTER TABLE `screen_state`
  ADD CONSTRAINT `FK_734ec69c008826a12d9723734b9` FOREIGN KEY (`screen_id`) REFERENCES `screens` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_d51b87b31d454ab871656f68149` FOREIGN KEY (`current_playlist_id`) REFERENCES `playlists` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
