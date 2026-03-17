# 🎮 JavaScript Quiz Challenge

A **gamified JavaScript quiz platform** built with the MERN stack. Test your JavaScript knowledge with thousands curated questions across 3 difficulty levels, compete on the global leaderboard, and learn while you play!

![Homepage](./screenshots/homepage.png)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 ** Randomized Questions** | Every quiz attempt shuffles questions for a unique experience |
| 📊 **3 Difficulty Levels** | Easy, Medium, and Hard to match your skill level |
| ⏱️ **Real-Time Timer** | Track how fast you can complete the quiz |
| 🔥 **Streak System** | Build consecutive correct answer streaks with milestone celebrations |
| 🎵 **Sound Effects** | Audio feedback for correct/wrong answers using Web Audio API |
| 🏆 **Global Leaderboard** | Ranked by score (desc) and time (asc) with difficulty filtering |
| 📚 **Weak Category Analysis** | After each quiz, see which topics need improvement |
| 🌙 **Dark Mode** | Toggle between light and dark themes (persisted in localStorage) |
| 📤 **Share Score** | Share results on WhatsApp, Twitter/X, and LinkedIn |
| 📱 **Responsive Design** | Works on mobile, tablet, and desktop |


## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, TailwindCSS v4, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Routing** | React Router v7 |
| **SEO** | React Helmet Async, OpenGraph / Twitter Card meta tags |
| **HTTP Client** | Axios |

## 📁 Project Structure

```
JavaScript-Game/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx      # Navigation with dark mode toggle
│   │   │   ├── Footer.jsx
│   │   │   ├── DifficultyCard.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── Timer.jsx
│   │   │   ├── StreakBadge.jsx
│   │   │   └── ShareModal.jsx
│   │   ├── pages/              # Route-level pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── ResultPage.jsx
│   │   │   ├── LeaderboardPage.jsx
│   │   │   └── AboutPage.jsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useTimer.js
│   │   │   └── useSound.js
│   │   ├── context/            # React Context providers
│   │   │   ├── QuizContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── utils/              # Helpers, API client, constants
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # TailwindCSS + design system
│   ├── index.html
│   └── vite.config.js
│
├── server/                     # Express backend
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/            # Business logic
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route definitions
│   ├── middlewares/            # Error handling, validation
│   ├── seeds/seedQuestions.js  # 150 quiz questions
│   └── server.js               # Entry point
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ → [Download](https://nodejs.org/)
- **MongoDB** running locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) account

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd JavaScript-Game
```

### 2. Setup Backend

```bash
cd server
npm install

# Create .env file (already included as template)
# Edit .env if using MongoDB Atlas:
# MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/jsquiz

# Seed the database with 150 questions
npm run seed

# Start the backend server
npm run dev
```

The backend will run on **http://localhost:5000**

### 3. Setup Frontend

```bash
cd client
npm install

# Start the Vite dev server
npm run dev
```

The frontend will run on **http://localhost:5173**

### 4. Play!

Open **http://localhost:5173** in your browser, enter your name, pick a difficulty, and start the quiz!

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/questions?difficulty=easy` | Get 50 randomized easy questions |
| `GET` | `/api/questions?difficulty=medium` | Get 50 randomized medium questions |
| `GET` | `/api/questions?difficulty=hard` | Get 50 randomized hard questions |
| `POST` | `/api/leaderboard` | Submit a quiz score |
| `GET` | `/api/leaderboard` | Get sorted leaderboard |
| `GET` | `/api/leaderboard?difficulty=hard` | Filter leaderboard by difficulty |
| `GET` | `/api/health` | Health check |

## 🌍 Deployment

### Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Set **Root Directory** to `client`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
7. Deploy!

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Set **Root Directory** to `server`
4. **Build Command**: `npm install`
5. **Start Command**: `node server.js`
6. Add environment variables:
   - `MONGO_URI=mongodb+srv://...` (your Atlas connection string)
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-app.vercel.app`
7. Deploy!

### Database → MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create a free cluster
2. Create a database user and whitelist your IP (or allow all: `0.0.0.0/0`)
3. Get the connection string and add it to your backend `.env` as `MONGO_URI`
4. Run `npm run seed` locally (pointed at Atlas) to populate questions

## 📜 License

MIT — feel free to use this project for learning!

---

<div align="center">
  <strong>Made with ❤️ for learning JavaScript</strong>
  <br>
  🎮 Challenge yourself • 🏆 Climb the leaderboard • 🚀 Have fun!
</div>
