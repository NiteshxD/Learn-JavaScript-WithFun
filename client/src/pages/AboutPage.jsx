// =============================================================================
// About Page — Project Info
// =============================================================================

import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const AboutPage = () => {
  const techStack = [
    { name: "MongoDB", emoji: "🍃", desc: "NoSQL database for questions & scores" },
    { name: "Express.js", emoji: "⚡", desc: "Backend framework for REST API" },
    { name: "React.js", emoji: "⚛️", desc: "Frontend UI library with Vite" },
    { name: "Node.js", emoji: "🟢", desc: "JavaScript runtime environment" },
    { name: "Socket.io", emoji: "🔌", desc: "Real-time multiplayer connections" },
    { name: "Framer Motion", emoji: "✨", desc: "Animation library for React" },
  ];

  const features = [
    "🎮 Randomized JavaScript questions per quiz",
    "📊 Three difficulty levels: Easy, Medium, Hard",
    "⏱️ Real-time timer tracking with milliseconds",
    "🔥 Correct answer streak system",
    "🎵 Sound effects for game feedback",
    "🏆 Global leaderboard with ranking",
    "🎉 Party mode — real-time multiplayer",
    "🌙 Dark mode support",
    "📤 Share your score on social media",
    "📚 Weak category analysis after each quiz",
  ];

  return (
    <>
      <Helmet>
        <title>About — JS Quiz Challenge</title>
        <meta name="description" content="Learn about the JavaScript Quiz Challenge platform." />
      </Helmet>
      <main style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 20px", position: "relative" }}>
        <div className="bg-pattern" />
        <div style={{ maxWidth: "800px", width: "100%", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "36px" }}>
            <h1 style={{
              fontFamily: "var(--font-heading)", fontSize: "clamp(1.2rem, 4vw, 2rem)", fontWeight: 900, letterSpacing: "3px",
              background: "linear-gradient(135deg, var(--color-accent), var(--color-pink), var(--color-sky))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              ℹ️ ABOUT THIS PROJECT
            </h1>
          </motion.div>

          {/* What Is This? */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="game-card" style={{ marginBottom: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", letterSpacing: "2px", marginBottom: "12px", color: "var(--color-primary)" }}>
              🎮 WHAT IS JS QUIZ?
            </h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.95rem" }}>
              JS Quiz Challenge is a gamified quiz platform designed to help you learn and test
              your JavaScript knowledge in a fun, interactive way. With curated questions across
              three difficulty levels, real-time scoring, streak tracking, multiplayer party mode,
              and a competitive leaderboard — learning JavaScript has never been more engaging!
            </p>
          </motion.div>

          {/* How to Play */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="game-card" style={{ marginBottom: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", letterSpacing: "2px", marginBottom: "12px", color: "var(--color-secondary)" }}>
              🕹️ HOW TO PLAY
            </h2>
            <ol style={{ color: "var(--text-secondary)", lineHeight: 2.2, paddingLeft: "20px", fontSize: "0.9rem" }}>
              <li>Enter your username on the home page</li>
              <li>Select a difficulty level and question count</li>
              <li>Answer randomized JavaScript questions</li>
              <li>Build streaks by answering correctly in a row</li>
              <li>View your results and weak areas after finishing</li>
              <li>Share your score and compete on the leaderboard!</li>
            </ol>
          </motion.div>

          {/* Features */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="game-card" style={{ marginBottom: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", letterSpacing: "2px", marginBottom: "14px", color: "var(--color-accent)" }}>
              ✨ FEATURES
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "8px" }}>
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600 }}
                >
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="game-card">
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", letterSpacing: "2px", marginBottom: "16px", color: "var(--color-sky)" }}>
              🛠️ TECH STACK
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              {techStack.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  style={{ padding: "18px", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", textAlign: "center", cursor: "default" }}
                >
                  <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{tech.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "var(--text-primary)", fontFamily: "var(--font-heading)", letterSpacing: "1px", marginBottom: "4px" }}>
                    {tech.name.toUpperCase()}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {tech.desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default AboutPage;
