Minimalny frontend do testowania API (CORS, API key, JWT)

Pliki:
- `index.html` — proste UI z przyciskami
- `api-client.js` — mały wrapper `fetch` z obsługą `x-api-key` i `Authorization: Bearer <token>`
- `app.js` — przykłady użycia wrappera + jedno wywołanie `axios` dla porównania

Uruchomienie lokalne (PowerShell):

1) Najprostsze (Node http-server):
```powershell
# zainstaluj za pierwszym razem
npx http-server .\frontend -p 5173
```
Otwórz `http://localhost:5173` w przeglądarce.

2) Albo Python (jeśli masz):
```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Jeśli backend (Nest) działa na `http://localhost:3000`, to z przeglądarki frontend będzie wysyłać żądania do tego adresu.
Domyślnie przykład trafia w istniejący backendowy `GET /` z `src/app.controller.ts`.

CORS:
- Jeśli backend nie zezwala na CORS, dodaj w `src/main.ts` przed `await app.listen(port);`:
```ts
app.enableCors({ origin: 'http://localhost:5173', credentials: true });
```
- Jeżeli używasz niestandardowych nagłówków (`x-api-key`) upewnij się, że serwer pozwala na nie w `Access-Control-Allow-Headers` (Nest `enableCors` to zazwyczaj załatwia).

Testy:
- W `app.js` zmień `MY_API_KEY` i `YOUR_JWT_TOKEN` na rzeczywiste wartości i kliknij odpowiedni przycisk.
- `api-client.js` obsługuje też `post(path, body, options)` jeśli chcesz rozbudować frontend.

Chcesz, żebym dodał automatyczne serwowanie frontendu z poziomu NestJS (statyczne pliki)? Mogę to zrobić szybko jeśli chcesz.
