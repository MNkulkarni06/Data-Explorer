# Nexus Data Explorer (AI-Powered)

Nexus is a sophisticated full-stack data exploration and analysis platform. It combines high-performance visualization with Google Gemini AI to provide actionable insights from your datasets.

## 🚀 Features

- **Full-Stack Architecture**: Express.js backend with Vite + React frontend.
- **Dynamic Visualization**: Multi-chart support (Area, Bar, Line, Pie, Composed) using Recharts.
- **AI Insights**: Real-time dataset analysis using the `gemini-3-flash-preview` model.
- **Data Ingestion**: Support for JSON dataset uploads with automatic normalization.
- **Frosted Glass UI**: Premium design theme with mesh gradients and blur effects.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, Vite Middleware.
- **AI**: @google/genai (Gemini AI SDK).

## 📋 Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure API Key**:
   Ensure your `GEMINI_API_KEY` is set in your environment variables. In AI Studio, this is managed via the Secrets panel.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 📁 Project Structure

- `server.ts`: Express backend entry point with Vite middleware.
- `src/App.tsx`: Main dashboard implementation with tabbed navigation.
- `src/services/aiService.ts`: Integration with Google Gemini API.
- `src/components/`: Reusable UI components (Charts, Stats, Uploader, AI Panel).
- `src/data/`: Mock datasets for initial system demonstration.
- `src/lib/utils.ts`: Utility helpers for Tailwind class merging.

## 🚢 Deployment

1. **Build**:
   ```bash
   npm run build
   ```
2. **Production Start**:
   The Express server handles serving the static `dist/` folder in production mode. Set `NODE_ENV=production` and run:
   ```bash
   node server.ts
   ```

---
*Created with focus on clean, modular architecture and production-ready patterns.*
