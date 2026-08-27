# Digital Signage CMS & Player (Praktyki)

Kompleksowy system Digital Signage klasy Content Management System (CMS) z niezależnym odtwarzaczem (Player) obsługującym tryb offline, inteligentne buforowanie IndexedDB oraz synchronizację opartą o rewizje manifestów.

---

## 🏛️ Architektura Systemu

Projekt jest podzielony na 3 główne moduły:

```
├── backend/    → Serwer REST API w NestJS 11 + TypeORM + MySQL + Swagger
├── frontend/   → Panel Administracyjny CMS w React 19 + Vite + TypeScript
└── player/     → Dedykowany Odtwarzacz ekranowy w React 19 + Vite + IndexedDB
```

```
┌─────────────────────────────────────────────────────────────┐
│                 PANEL CMS (frontend/)                       │
│    Zarządzanie mediami, playlistami, ekranami i logami      │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API (OpenAPI)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   SERWER (backend/)                         │
│   • FilesModule      • ScreensModule     • Database/MySQL   │
│   • PlaylistsModule  • SyncModule        • LogCleanupCron   │
└──────────────────────────────▲──────────────────────────────┘
                               │ Sync / Heartbeat / Telemetria
                               │ (Nagłówek X-Screen-ID)
┌──────────────────────────────┴──────────────────────────────┐
│                  ODTWARZACZ (player/)                       │
│   • Pętla odtwarzania (obraz / wideo / fallback)            │
│   • Magazyn IndexedDB (pliki Blob + aktywny manifest)       │
│   • Praca Offline + Auto-Sync + Heartbeat + Logi            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Opis Modułów

### 1. `backend/` — Serwer NestJS & Baza Danych
- **Technologie**: NestJS 11, TypeORM, MySQL 2, Swagger/OpenAPI, Class-Validator.
- **Główne moduły**:
  - `FilesModule`: Upload plików multimedialnych (`multipart/form-data`), streaming plików (`/files/:id/content`), wykrywanie typu (obraz/wideo), weryfikacja użycia w playlistach przed usunięciem.
  - `PlaylistsModule`: Tworzenie playlist, dodawanie elementów z pozycją i czasem trwania (`duration`, `videoLoops`), zmiana kolejności (`/playlists/:id/reorder`), wersjonowanie rewizji (`revision`).
  - `ScreensModule`: Rejestracja urządzeń/ekranów, generowanie unikalnych `apiKey`, przypisywanie playlist z priorytetami i oknami czasowymi (`activeFrom`, `activeTo`), monitoring statusu online.
  - `SyncModule`: Kluczowy moduł synchronizacji. Generuje manifesty JSON z buforowaniem w tabeli `cache_manifests`, weryfikuje rewizje (`OK` / `NOT_CHANGED`), odbiera telemetrię i błędy (`/sync/:screenId/logs`), aktualizuje pozycję odtwarzania (`/sync/:screenId/state`) i odbiera heartbeat (`/sync/:screenId/heartbeat`).
  - `LogCleanupService`: Automatyczne zadanie Cron (codziennie o 12:00) usuwające logi starsze niż 30 dni oraz dbające o limit 100 000 rekordów.

### 2. `frontend/` — Panel Administracyjny CMS
- **Technologie**: React 19, Vite, TypeScript, wygenerowany klient OpenAPI (`frontend/src/api`).
- **Główne widoki**:
  - **Pliki (`FilesPage`)**: Przeglądanie listy plików, upload z walidacją rozmiaru i formatu, filtry (Wideo/Obrazy), usuwanie z blokadą jeśli plik jest w użyciu.
  - **Playlisty (`PlaylistPage`)**: Lista playlist, tworzenie nowych playlist, podgląd liczby elementów.
  - **Edycja Playlisty (`PlaylistEditPage`)**: Dodawanie mediów, ustawianie czasu wyświetlania oraz liczby pętli wideo, zmiana kolejności (Drag/Order), detekcja niezapisanych zmian (`isDirty`).
  - **Ekrany (`ScreensPage`)**: Lista ekranów z odświeżaniem na żywo co 5s, indykatory statusu online, lokalizacja, link bezpośredni do odtwarzacza (`playerUrl`).
  - **Edycja Ekranu (`ScreenEditPage`)**: Przypisywanie wielu playlist z priorytetami, wybór pliku awaryjnego (fallback), generowanie nowego `apiKey`.
  - **Logi (`LogsPage`)**: Przeglądarka telemetrii z ekranów w czasie rzeczywistym z podziałem na poziomy (INFO, WARN, ERROR, PLAYBACK).

### 3. `player/` — Odtwarzacz Ekranowy
- **Technologie**: React 19, Vite, TypeScript, IndexedDB API.
- **Funkcjonalności**:
  - Identyfikacja ekranu za pomocą parametru URL `?screenId=<ID>`.
  - Lokalne buforowanie plików i manifestu w przeglądarkowej bazie IndexedDB (`digital-signage-player`).
  - Obsługa pełnego trybu **offline** — odtwarzanie trwa nieprzerwanie nawet po odłączeniu sieci.
  - Odtwarzanie zasobu awaryjnego (**Fallback Asset**) w przypadku braku playlisty lub błędów pobierania.
  - Automatyczne raportowanie stanu odtwarzania, heartbeat oraz telemetrii błędów na serwer.

---

## 🗄️ Schemat Bazy Danych

System korzysta z relacyjnej bazy danych MySQL z następującymi tabelami:

| Tabela | Opis | Kluczowe pola |
|---|---|---|
| `files` | Metadane plików multimedialnych | `id`, `filename`, `original_name`, `path`, `mime_type`, `size`, `checksum`, `duration`, `created_at` |
| `playlists` | Grupy logiczne mediów | `id`, `name`, `description`, `revision`, `created_at`, `updated_at` |
| `playlist_items` | Pozycje w playliście | `id`, `playlist_id`, `file_id`, `position`, `duration`, `video_loops`, `created_at` |
| `screens` | Zarejestrowane ekrany/urządzenia | `id`, `name`, `location`, `api_key`, `fallback_file_id`, `player_url`, `is_online`, `last_seen` |
| `screen_playlists` | Harmonogramy i przypisania | `id`, `screen_id`, `playlist_id`, `priority`, `active_from`, `active_to`, `revision` |
| `screen_state` | Stan wykonawczy ekranu | `screen_id`, `last_sync`, `current_playlist_id`, `current_index`, `visible`, `updated_at` |
| `cache_manifests` | Gotowy zbuforowany manifest JSON | `screen_id`, `revision`, `manifest` (JSON), `updated_at` |
| `screen_logs` | Logi i telemetria odtwarzacza | `id`, `screen_id`, `level` (INFO/WARN/ERROR/PLAYBACK), `message`, `created_at` |

---

## 🌐 Endpointy REST API

Dokumentacja interaktywna Swagger dostępna jest pod adresem: `http://localhost:3000/api`

### 📁 Pliki (`/files`)
- `POST /files/upload` — Upload pliku z dysku (Multipart)
- `POST /files` — Dodanie metadanych pliku
- `GET /files` — Pobranie wszystkich plików
- `GET /files/videos` — Filtrowanie: tylko wideo
- `GET /files/images` — Filtrowanie: tylko obrazy
- `GET /files/:id` — Pobranie metadanych pliku
- `GET /files/:id/content` — Strumieniowanie zawartości pliku binarnego
- `GET /files/:id/used` — Sprawdzenie, czy plik jest wykorzystywany w playlistach
- `PUT /files/:id` — Aktualizacja metadanych
- `DELETE /files/:id` — Usunięcie pliku (zabezpieczone przed usunięciem plików w użyciu)

### 📋 Playlisty (`/playlists`)
- `POST /playlists` — Utworzenie nowej playlisty
- `GET /playlists` — Pobranie listy playlist wraz z elementami
- `GET /playlists/:id` — Szczegóły playlisty
- `GET /playlists/:id/revision` — Pobranie aktualnego numeru rewizji
- `PUT /playlists/:id` — Aktualizacja playlisty
- `DELETE /playlists/:id` — Usunięcie playlisty
- `POST /playlists/:id/items` — Dodanie pliku do playlisty
- `DELETE /playlists/:id/items/:itemId` — Usunięcie pozycji z playlisty
- `PUT /playlists/:id/reorder` — Zmiana kolejności elementów

### 🖥️ Ekrany (`/screens`)
- `POST /screens` — Utworzenie ekranu (auto-generowanie klucza API)
- `GET /screens` — Lista wszystkich ekranów ze stanem i statusem online
- `GET /screens/:id` — Szczegóły ekranu z przypisanymi playlistami
- `PUT /screens/:id` — Aktualizacja konfiguracji ekranu
- `DELETE /screens/:id` — Usunięcie ekranu
- `POST /screens/:id/playlists` — Przypisanie playlisty (z priorytetem i zakresem dat)
- `PUT /screens/:id/playlists/:playlistId` — Aktualizacja przypisania
- `DELETE /screens/:id/playlists/:playlistId` — Odpięcie playlisty od ekranu
- `POST /screens/:id/api-key` — Wygenerowanie nowego klucza API
- `GET /screens/location/:location` — Filtrowanie ekranów po lokalizacji

### 🔄 Synchronizacja & Telemetria (`/sync`)
- `GET /sync/manifest` — Pobranie manifestu ekranu (Wymagany nagłówek `X-Screen-ID`, opcjonalny parametr `?sinceRevision=...`)
- `GET /sync/:screenId/check?currentRevision=...` — Szybkie sprawdzenie czy zmienił się manifest
- `GET /sync/:screenId/fallback` — Pobranie dedykowanego pliku awaryjnego
- `POST /sync/:screenId/heartbeat` — Sygnał życia ekranu (`playerUrl`, `visible`)
- `POST /sync/:screenId/state` — Aktualizacja pozycji odtwarzania (`currentPlaylistId`, `currentIndex`, `visible`)
- `POST /sync/:screenId/logs` — Wysłanie zdarzenia/błędu z odtwarzacza do bazy
- `GET /sync/:screenId/logs` — Pobranie ostatnich logów ekranu

---

## 🚀 Uruchamianie Projektu

### Wymagania wstępne
- **Node.js**: >= 18.x
- **Baza danych**: MySQL 8.x lub MariaDB

### 1. Konfiguracja zmiennych środowiskowych
Skopiuj plik `.env.example` do `.env` w katalogu głównym lub w `backend/`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=twoje_haslo
DB_NAME=praktyki
PORT=3000
```

Dla aplikacji frontendowych (`frontend/` i `player/`):
```env
VITE_API_URL=http://localhost:3000
```

### 2. Backend (Serwer API)
```bash
cd backend
npm install
npm run start:dev
```
API będzie dostępne pod adresem: `http://localhost:3000` (Swagger pod `/api`).

### 3. Frontend (Panel CMS)
```bash
cd frontend
npm install
npm run dev
```
Panel administracyjny uruchomi się standardowo pod adresem podanym przez Vite (np. `http://localhost:5173`).

### 4. Player (Odtwarzacz)
```bash
cd player
npm install
npm run dev
```
Odtwarzacz uruchamia się pod adresem np. `http://localhost:5174/?screenId=1`.

---

## 🧪 Testy

W projekcie skonfigurowano środowisko testowe Jest dla backendu oraz testy klienta API:
```bash
# Uruchomienie testów jednostkowych backendu
cd backend
npm test

# Uruchomienie testów w trybie watch
npm run test:watch

# Raport pokrycia testami
npm run test:cov
```
