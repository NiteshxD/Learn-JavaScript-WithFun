// =============================================================================
// App Root — Layout, Routing, and context Providers
// =============================================================================

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext";
import { QuizProvider } from "./context/QuizContext";
import { SocketProvider } from "./context/SocketContext";
import { PartyProvider } from "./context/PartyContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AboutPage from "./pages/AboutPage";
import PartyPage from "./pages/PartyPage";
import LobbyPage from "./pages/LobbyPage";
import MultiplayerQuizPage from "./pages/MultiplayerQuizPage";
import PartyResultPage from "./pages/PartyResultPage";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <QuizProvider>
          <SocketProvider>
            <PartyProvider>
              <Router>
                <div
                  style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    transition: "background 0.3s, color 0.3s",
                  }}
                >
                  <Navbar />
                  <div style={{ flex: 1 }}>
                    <Routes>
                      {/* Solo Mode */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/quiz" element={<QuizPage />} />
                      <Route path="/result" element={<ResultPage />} />

                      {/* Party Mode */}
                      <Route path="/party" element={<PartyPage />} />
                      <Route path="/lobby" element={<LobbyPage />} />
                      <Route path="/multiplayer-quiz" element={<MultiplayerQuizPage />} />
                      <Route path="/party-result" element={<PartyResultPage />} />

                      {/* Global */}
                      <Route path="/leaderboard" element={<LeaderboardPage />} />
                      <Route path="/about" element={<AboutPage />} />
                    </Routes>
                  </div>
                  <Footer />
                </div>
              </Router>
            </PartyProvider>
          </SocketProvider>
        </QuizProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
