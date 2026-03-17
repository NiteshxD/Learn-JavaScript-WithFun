// =============================================================================
// App.jsx — Root Application Component
// =============================================================================
// Sets up React Router for page navigation and wraps the app with
// context providers and layout components (Navbar, Footer).
//
// ARCHITECTURE:
//   HelmetProvider → ThemeProvider → QuizProvider → Router → Layout → Pages
//
// WHY THIS ORDER?
//   - HelmetProvider: Must wrap any component using <Helmet>
//   - ThemeProvider: Must wrap everything so dark mode applies globally
//   - QuizProvider: Must wrap all quiz-related pages
//   - BrowserRouter: React Router provides navigation context
// =============================================================================

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext";
import { QuizProvider } from "./context/QuizContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AboutPage from "./pages/AboutPage";
import "./index.css";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <QuizProvider>
          <Router>
            {/* Main layout wrapper */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
            >
              <Navbar />

              {/* Page Routes */}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>

              <Footer />
            </div>
          </Router>
        </QuizProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
