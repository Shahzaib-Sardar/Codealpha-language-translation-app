# Server: Language Translation API


Exposes a single endpoint `POST /translate` that uses the MyMemory Translation API (https://api.mymemory.translated.net/get).

Usage

1. Copy `.env.example` to `.env` if you want to override `PORT`.
2. Install dependencies and start:

```powershell
cd server
npm install
npm start
```

Request format

POST /translate
Content-Type: application/json

Body: `{ "text": "Hello", "sourceLang": "en", "targetLang": "es" }`

Response: `{ "translatedText": "Hola" }`

Notes

- This server calls the MyMemory public API (no API key required for basic use), which has rate limits and may return approximate translations. For higher reliability consider a paid service or a self-hosted solution.
- The server returns HTTP 400 for invalid input and HTTP 500 for provider errors.
