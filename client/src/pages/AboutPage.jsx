// =============================================================================
// About Page
// =============================================================================
// Information about the project, tech stack, and how to play.
// =============================================================================

import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const AboutPage = () => {
  const techStack = [
    { name: "MongoDB", emoji: "🍃", desc: "NoSQL database for questions & scores" },
    { name: "Express.js", emoji: "⚡", desc: "Backend framework for REST API" },
    { name: "React.js", emoji: "⚛️", desc: "Frontend UI library with Vite" },
    { name: "Node.js", emoji: "🟢", desc: "JavaScript runtime environment" },
    { name: "TailwindCSS", emoji: "🎨", desc: "Utility-first CSS framework" },
    { name: "Framer Motion", emoji: "✨", desc: "Animation library for React" },
  ];

  const features = [
    "🎮 50 randomized JavaScript questions per quiz",
    "📊 Three difficulty levels: Easy, Medium, Hard",
    "⏱️ Real-time timer tracking",
    "🔥 Correct answer streak system",
    "🎵 Sound effects for game feedback",
    "🏆 Global leaderboard with ranking",
    "📱 Fully responsive design",
    "🌙 Dark mode support",
    "📤 Share your score on social media",
    "📚 Weak category analysis after each quiz",
  ];

  return (
    <>
      <Helmet>
        <title>About — JS Quiz Challenge</title>
        <meta name="description" content="Learn about the JavaScript Quiz Challenge platform. Built with the MERN stack." />
      </Helmet>

      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          padding: "32px 20px",
          maxWidth: "800px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div className="bg-pattern" />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", marginBottom: "36px" }}
          >
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                background: "linear-gradient(135deg, var(--color-accent), var(--color-pink))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ℹ️ About This Project
            </h1>
          </motion.div>

          {/* What Is This? */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="game-card"
            style={{ marginBottom: "24px" }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.4rem",
                marginBottom: "12px",
                color: "var(--color-primary)",
              }}
            >
              🎮 What is JS Quiz Challenge?
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                fontSize: "1rem",
              }}
            >
              JS Quiz Challenge is a gamified quiz platform designed to help you learn and test
              your JavaScript knowledge in a fun, interactive way. With 150 curated questions across
              three difficulty levels, real-time scoring, streak tracking, and a competitive leaderboard,
              learning JavaScript has never been more engaging!
            </p>
          </motion.div>

          {/* How to Play */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="game-card"
            style={{ marginBottom: "24px" }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.4rem",
                marginBottom: "12px",
                color: "var(--color-secondary)",
              }}
            >
              🕹️ How to Play
            </h2>
            <ol
              style={{
                color: "var(--text-secondary)",
                lineHeight: 2,
                paddingLeft: "20px",
              }}
            >
              <li>Enter your username on the home page</li>
              <li>Select a difficulty level (Easy, Medium, or Hard)</li>
              <li>Answer 50 randomized JavaScript questions</li>
              <li>Build streaks by answering correctly in a row</li>
              <li>View your results and weak areas after finishing</li>
              <li>Share your score and compete on the leaderboard!</li>
            </ol>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="game-card"
            style={{ marginBottom: "24px" }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.4rem",
                marginBottom: "14px",
                color: "var(--color-accent)",
              }}
            >
              ✨ Features
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "8px",
              }}
            >
              {features.map((feature, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {feature}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="game-card"
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.4rem",
                marginBottom: "16px",
                color: "var(--color-sky)",
              }}
            >
              🛠️ Tech Stack
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
              }}
            >
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  style={{
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-secondary)",
                    textAlign: "center",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>{tech.emoji}</div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      color: "var(--text-primary)",
                      marginBottom: "4px",
                    }}
                  >
                    {tech.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    {tech.desc}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default AboutPage;
