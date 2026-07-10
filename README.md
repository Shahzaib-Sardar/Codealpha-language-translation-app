# Language Translation Tool

A full-stack web app that translates text between languages in real time, built as part of my AI Externship at CodeAlpha.

## What it does
- User types text, selects a source and target language, and gets an instant translation.
- Includes copy-to-clipboard and text-to-speech (hear the translation read aloud).
- Handles errors gracefully if the translation service is unreachable or input is invalid.

## Tech Stack
- **Frontend:** React.js (Vite) — UI, dropdowns, state management
- **Backend:** Node.js + Express — API layer between frontend and translation provider
- **Translation Provider:** MyMemory Translation API (free, no auth required)
- **Browser API:** Web Speech API for text-to-speech

## Why this architecture
I didn't call the translation API directly from the frontend — I put a Node/Express backend in between. This matters because:
- It keeps API logic server-side, so if I ever add an API key (e.g., switching to Google Translate), it's never exposed in browser code.
- It's a standard pattern in production apps: frontend never talks to third-party APIs directly.

## Why MyMemory instead of Google Translate / LibreTranslate
- Google Translate API requires a billing-enabled account — unnecessary overhead for this project's scope.
- I initially tried LibreTranslate, but its public endpoints now require a paid API key/portal signup, so requests were being blocked.
- MyMemory has a free, no-signup GET endpoint with a generous daily limit, making it the most practical choice for a working demo.

## How it works (request flow)
1. User enters text + selects languages in the React UI.
2. Frontend sends a POST request to `/translate` on the Express backend with `{ text, sourceLang, targetLang }`.
3. Backend validates the input, then calls MyMemory's API:
	`GET https://api.mymemory.translated.net/get?q={text}&langpair={source}|{target}`
4. Backend extracts `responseData.translatedText` from MyMemory's response and returns it as JSON.
5. Frontend displays the translated text, and enables copy/speak actions.

## Features
- [x] Text input + source/target language dropdowns
- [x] Translate via API
- [x] Display translated text
- [x] Copy-to-clipboard button
- [x] Text-to-speech (Web Speech API)
- [x] Swap source/target languages
- [x] Loading state + error handling

## Running locally

**Backend:**
```powershell
cd server
npm install
copy .env.example .env
npm start
```
Runs on `http://localhost:4000`

**Frontend:**
```powershell
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173`

## Known limitations
- MyMemory doesn't support true auto-detect for source language in this implementation.
- Free tier has a daily request limit (~5,000 words/day per IP) — fine for demo use, not production scale.

## What I'd improve with more time
- Add caching for repeated translation requests
- Add a fallback provider if MyMemory is down
- Add more language options
