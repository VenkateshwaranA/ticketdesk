# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1?showAssistant=true&showCode=true&showTreeView=true&showPreview=true

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. (Optional) Create `.env.local` and set:
   - `VITE_API_BASE=http://localhost:3000/api`
3. Ensure backend services are running:
   - Gateway on `3000` (prefix `api`)
   - Users service on `3012`, Tickets service on `3013`
4. Run the app:
   `npm run dev`
