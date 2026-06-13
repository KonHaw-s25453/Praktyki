# Screen Cache — projekt (Polski)

Cel: ekran (player) musi mieć lokalny cache manifestu i plików, żeby nie polegać na "live SQL" i żeby odtwarzać nawet offline.

1) Co cachujemy na ekranie

- Manifest: lista przypisanych playlist oraz ich priorytetów/harmonogramów (`screen_playlists`).
- Dla każdej playlisty: kolejność `playlist_items` z ich `position`, `duration`.
- Metadane plików z `files`: `id`, `filename`, `path` (URL), `mime_type`, `size`, `checksum`.
- Prefetchowane pliki multimedialne (pobrane do lokalnego storage/a filesystemu).

2) Schemat wersjonowania / invalidation (zalecenia)

- Każda encja mająca znaczenie dla odtwarzania powinna mieć `updated_at` i/lub `revision` (INT).
- Zmiana zawartości playlisty, pozycji lub przypisania ekranu powinna inkrementować odpowiedni `revision` (aplikacja).
- Serwer zwraca manifest z polem `revision` (np. najwyższe z `screen_playlists.revision` i `playlists.revision`).

3) API: proste i odporne

- GET `/api/v1/screens/manifest`

  - Auth: `Authorization: ApiKey <api_key>` lub `X-API-KEY` header.
  - Query: `?since_revision=123`
  - Response 200: `{ "revision": 124, "playlists": [...], "files": [...] }`
  - Response 304: empty (jeśli `since_revision` jest aktualne)
- POST `/api/v1/screens/heartbeat`

  - Body: `{ "last_seen": "2026-06-06T..." }` (opcjonalnie)
- POST `/api/v1/screens/logs`

  - Body: `{ "events": [{"type":"playback","file_id":1,"status":"ok","timestamp":"..."}, ...] }`

4) Manifest (przykład)

```
{
  "revision": 124,
  "assigned_playlists": [
    { "playlist_id": 10, "priority": 1, "active_from": null, "active_to": null },
    { "playlist_id": 12, "priority": 2, "active_from": "2026-06-06T08:00:00", "active_to": "2026-06-06T10:00:00" }
  ],
  "playlists": [
    { "id": 10, "name": "Main", "revision": 5, "items": [ {"position":1, "file_id":3, "duration":15}, ... ] }
  ],
  "files": [
    { "id":3, "path":"https://cdn.example.com/media/3.mp4", "mime_type":"video/mp4", "size":1234567, "checksum":"...sha256..." }
  ]
}
```

5) Algorytm synchronizacji (ekran)

- Na starcie: GET `/manifest` bez `since_revision` (or `0`).
- Jeśli 200: zapisz manifest atomowo (zapisać najpierw manifest, potem prefetch plików). Zaimplementuj staging: pobierz nowe pliki do tymczasowego folderu i po sukcesie dokonaj swap.
- Jeśli 304: nic nie rób.
- Polling: co N sekund/minut (np. 30s–5min w zależności od charakteru). Alternatywa: serwer push (WebSocket/MQTT) do natychmiastowego powiadomienia o zmianach.
- W razie braku sieci: graj z lokalnego cache. Zgłoś w logach `screen_logs` problemy z aktualizacją.

11) `screen_state` — szybki stan odtwarzacza

- `screen_state` (tabela migracji `migrations/003_create_screen_state.sql`) przechowuje per-screen runtime state:
  - `last_sync` — czas ostatniego pobrania manifestu;
  - `last_playlist_hash` — opcjonalny hash manifestu/playlisty do szybkiego porównania;
  - `current_playlist_id`, `current_index` — gdzie ekran aktualnie odtwarza (do przywrócenia po restarcie);
  - `updated_at` — automatyczna aktualizacja timestampem.
- Użytkowanie:
  - Ekran może zapisywać swój `screen_state` periodicznie (np. przy zmianie pozycji) aby umożliwić wznowienie po restarcie lub utracie sieci.
  - Serwer może odczytywać `screen_state` do diagnostyki i do podania differentialnego manifestu.

6) Pobieranie plików

- Pliki serwowane przez CDN/HTTP(s) (najlepiej z obsługą Range dla wideo). Można generować podpisane URL na ograniczony czas.
- Weryfikacja: po pobraniu sprawdź `checksum` (sha256) i rozmiar.
- Polityka przestrzeni: quota, LRU eviction; najstarsze nieużywane pliki usuwaj, zostaw minimalny zestaw.

7) Bezpieczeństwo

- Zawsze HTTPS.
- `api_key` w nagłówku; nie umieszczaj go w URL.
- Dostarczać podpisane URL do plików gdy chcesz ograniczyć dostęp.

8) Logowanie i telemetria

- Ekrany wysyłają `playback` events + `errors` do `/screens/logs`.
- Agreguj logs ułatwiające debugowanie (last_seen, manifest_revision, download failures).

9) Wyzwalacze po stronie serwera

- Przy edycji playlist/playlist_items/screen_playlists inkrementuj `revision` i/lub zaktualizuj `updated_at`.
- Możesz generować i zapisywać `cache_manifests` dla każdego `screen_id` i zwracać gotowy JSON do klienta.

10) Dalsze usprawnienia

- Push updates via MQTT/WebSocket for immediate updates.
- Differential manifests (lista changed/removed file ids) by zmniejszyć payload.
- Wersjonowanie plików (np. content hash w ścieżce) ułatwia CDN cache invalidation.
