# Media / Player DB schema

Zawiera migrację tworzącą tabele potrzebne do zarządzania multimediami, playlistami i device'ami (players/screens).

Pliki dodane:
  - `files` — metadane plików multimedialnych
    - pola: `filename`, `original_name`, `path`, `mime_type` (NOT NULL, np. `image/*` lub `video/*`), `duration` (opcjonalne, tylko dla wideo), `size`, `created_at`
  - `screens` — ekrany / urządzenia (z `api_key` jako prostym auth)
  - `playlists` — logiczne grupy plików
  - `playlist_items` — kluczowa tabela kolejności i czasu trwania
  - `screen_playlists` — przypisania playlist do ekranów (harmonogramy)

  - `screen_state` — tabela przechowująca runtime state ekranu (ostatni sync, aktualna pozycja). Migracja: `migrations/003_create_screen_state.sql`.
 
  - Dodatkowe migracje:
    - `migrations/004_add_indexes.sql` — dodaje rekomendowane indeksy (przyspiesza zapytania manifestów).
    - `migrations/005_triggers_and_proc.sql` — zawiera:
      - wyzwalacze (triggers) które inkrementują `revision` przy zmianach w `playlists` i `playlist_items`;
      - procedurę `regenerate_cache_manifest(screen_id)` która generuje i zapisuje manifest JSON do `cache_manifests` (ułatwia szybką obsługę ekranów).

  Jak używać procedury (przykład):
  ```sql
  CALL regenerate_cache_manifest(42);
  SELECT manifest FROM cache_manifests WHERE screen_id = 42;
  ```

    Konsolidacja migracji
    - Podczas projektowania rozbiłem zmiany na kilka plików SQL — to ułatwia iterację i testowanie pojedynczych kroków (schemat → indeksy → triggery → seedy). Jeśli chcesz jedną, gotową migrację do uruchomienia na produkcji, dodałem `migrations/001_full_schema.sql` zawierający całość w porządku inicjalizacji.
    - Możesz uruchomić tylko `migrations/001_full_schema.sql` zamiast kolejno uruchamiać mniejsze pliki.

  - `screen_logs` — logi z playerów

Jak uruchomić migrację (PowerShell):

```powershell
# Z katalogu repozytorium, dostosuj użytkownika/host/bazę
mysql -u <user> -p -h <host> <database> < migrations/001_create_media_schema.sql
```

Sugestie / next steps:
- Dodać seed-y (przykładowe playlisty / pliki) do `migrations/`.
- Dodać migracje kolejnych zmian zamiast edytować istniejącej migracji.
- Backup bazy przed uruchomieniem na produkcji.

Jeśli chcesz, mogę: dodać seed, przygotować skrócony ER diagram albo wygenerować migrację w formacie frameworka (Flyway, Liquibase, Knex itp.).

Cache ekranu i fallback
- Dokumentacja projektu cache ekranu znajduje się w `docs/screen-cache.md`.
- Ekrany mogą mieć fallback asset (logo / komunikat awaryjny) przechowywany w `screens.fallback_file_id` — jest używany gdy ekran traci połączenie z serwerem.

SYNC endpoint queries
- Plik `migrations/002_sync_queries.sql` zawiera gotowe SQL queries do implementacji SYNC endpointa:
  - Query 1: pobierz pełny manifest (JSON) dla ekranu
  - Query 2: sprawdź czy manifest się zmienił (revision check)
  - Query 3: pobierz fallback asset (wideo/logo awaryjne)
  - Query 4: pełna odpowiedź SYNC (manifest + fallback + screen_state)
  - Query 5: update last_seen (heartbeat)
  - Query 6: update screen_state (zapis pozycji odtwarzania)
  - Query 7: regeneruj manifest cache dla ekranu

