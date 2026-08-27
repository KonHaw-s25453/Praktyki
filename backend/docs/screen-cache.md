# Screen Cache & Sync Architecture — Dokumentacja Techniczna

Dokument opisuje zrealizowaną architekturę pamięci podręcznej (Cache) oraz protokół synchronizacji pomiędzy serwerem NestJS a aplikacją odtwarzacza (Player).

---

## 1. Architektura Pamięci Podręcznej Odtwarzacza (IndexedDB)

Aplikacja `player/` wykorzystuje przeglądarkową bazę **IndexedDB** (`digital-signage-player`, wersja 1) do trwałego przechowywania treści i manifestu na urządzeniu końcowym.

### Magazyny Obiektów (Object Stores):
1. **`files`** (klucz główny: `id` - liczba):
   - Przechowuje pobrane pliki binarne jako obiekty `Blob`.
   - Struktura rekordu:
     ```typescript
     {
       id: number,
       filename: string,
       mimeType: string,
       size: number,
       checksum: string,
       blob: Blob
     }
     ```
2. **`manifest`** (klucz główny: `key` - ciąg znaków):
   - Przechowuje aktualnie obowiązujący manifest pod kluczem `"active"`.

---

## 2. Protokół Synchronizacji i Wersjonowania (Revisions)

Każda zmiana w konfiguracji playlist, pozycji mediów lub harmonogramów ekranów wpływa na numer rewizji (`revision`).

### Algorytm Serwerowy (`SyncService`):
1. Obliczenie rewizji manifestu jako maksymalnej wartości `revision` ze wszystkich aktywnych przypisań (`screen_playlists`) oraz samych playlist (`playlists.revision`).
2. Buforowanie gotowej struktury JSON w tabeli `cache_manifests`.
3. Jeśli ekran przesyła w zapytaniu swój aktualny numer rewizji (`sinceRevision`), serwer porównuje go z rewizją w bazie:
   - Jeżeli `sinceRevision === cachedManifest.revision` → Serwer zwraca:
     ```json
     {
       "revision": 12,
       "manifest": {},
       "status": "NOT_CHANGED"
     }
     ```
   - Jeżeli `sinceRevision` jest starsze lub niepodane → Serwer generuje/odczytuje pełny manifest i zwraca:
     ```json
     {
       "revision": 15,
       "manifest": { ... },
       "status": "OK"
     }
     ```

---

## 3. Rzeczywiste Endpointy API Synchronizacji (`/sync`)

### 1) Pobranie manifestu
- **Metoda / Ścieżka**: `GET /sync/manifest`
- **Nagłówki**: `X-Screen-ID: <screenId>` (Wymagany)
- **Parametry Query**: `?sinceRevision=<numer>` (Opcjonalny)
- **Odpowiedź**:
  ```json
  {
    "revision": 5,
    "status": "OK",
    "manifest": {
      "screenId": 1,
      "timestamp": "2026-08-26T17:00:00.000Z",
      "playlists": [
        {
          "id": 1,
          "name": "Poranna Playlista",
          "items": [
            {
              "position": 1,
              "duration": 10,
              "videoLoops": 1,
              "file": {
                "id": 3,
                "filename": "kampania.mp4",
                "path": "backend/files/...",
                "mimeType": "video/mp4",
                "size": 1048576,
                "checksum": "a1b2c3..."
              }
            }
          ]
        }
      ],
      "fallback": {
        "id": 9,
        "filename": "logo.png",
        "path": "backend/files/...",
        "mimeType": "image/png",
        "size": 52428,
        "checksum": "f4e5d6..."
      }
    }
  }
  ```

### 2) Sygnał życia (Heartbeat)
- **Metoda / Ścieżka**: `POST /sync/:screenId/heartbeat`
- **Body**:
  ```json
  {
    "playerUrl": "http://localhost:5174/?screenId=1",
    "visible": true
  }
  ```
- **Działanie**: Aktualizuje kolumny `last_seen`, `player_url` oraz `is_online` ekranu.

### 3) Aktualizacja stanu wykonawczego (Screen State)
- **Metoda / Ścieżka**: `POST /sync/:screenId/state`
- **Body**:
  ```json
  {
    "currentPlaylistId": 1,
    "currentIndex": 2,
    "visible": true
  }
  ```
- **Działanie**: Zapisuje aktualną pozycję odtwarzania w tabeli `screen_state`.

### 4) Rejestracja logów telemetrycznych
- **Metoda / Ścieżka**: `POST /sync/:screenId/logs`
- **Body**:
  ```json
  {
    "message": "Playback error: Media decode failed for item 3",
    "level": "ERROR"
  }
  ```
- **Dozwolone poziomy**: `INFO`, `WARN`, `ERROR`, `PLAYBACK`.

### 5) Pobranie pliku awaryjnego (Fallback)
- **Metoda / Ścieżka**: `GET /sync/:screenId/fallback`
- **Odpowiedź**: Metadane pliku fallback przypisanego do ekranu.

---

## 4. Cykl Pracy Odtwarzacza (Player Runtime Lifecycle)

1. **Inicjalizacja**:
   - Odczyt `screenId` z adresu URL.
   - Otwarcie IndexedDB.
   - Jeśli istnieje zbuforowany manifest w IndexedDB → natychmiastowy start odtwarzania (`PLAY`).
2. **Synchronizacja w tle (`syncManifest`)**:
   - Wywołanie `GET /sync/manifest` z `X-Screen-ID`.
   - Jeśli `status === 'OK'`:
     - Sprawdzenie dostępnej przestrzeni magazynowej przez `canFitMissingFiles`.
     - Pobranie nowych plików multimedialnych (`GET /files/:id/content`) jako `Blob` i zapis do IndexedDB.
     - Usunięcie z bazy IndexedDB plików osieroconych (nieznajdujących się w nowym manifeście ani w fallback).
     - Zapisanie nowego manifestu pod kluczem `active`.
3. **Pętla Emisji**:
   - Wyświetlanie mediów z lokalnych URL-i `URL.createObjectURL(blob)`.
   - W przypadku braku sieci odtwarzanie kontynuowane jest w 100% z pamięci podręcznej.
   - W przypadku braku plików lub błędu krytycznego odtwarzacz przechodzi w tryb `FALLBACK` i ponawia zapytania synchronizacyjne co zadany czas.
