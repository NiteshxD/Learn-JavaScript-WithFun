// =============================================================================
// Navbar Component
// =============================================================================
// Site-wide navigation with playful game-inspired styling.
// Includes dark mode toggle and responsive mobile menu.
// =============================================================================

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { NAV_LINKS } from "../utils/constants";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: theme === "dark" 
          ? "rgba(15, 23, 42, 0.9)" 
          : "rgba(254, 252, 232, 0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: `2px solid var(--border-color)`,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo / Brand */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontFamily: "var(--font-heading)",
              fontSize: "1.6rem",
              color: "var(--color-primary)",
            }}
          >
            <span style={{ fontSize: "1.8rem" }}>🎮</span>
            <span>JS Quiz</span>
          </motion.div>
        </Link>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          className="desktop-nav"
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.path} to={link.path} style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "8px 18px",
                  borderRadius: "var(--radius-full)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: location.pathname === link.path
                    ? "#fff"
                    : "var(--text-secondary)",
                  background: location.pathname === link.path
                    ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))"
                    : "transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {link.emoji} {link.label}
              </motion.div>
            </Link>
          ))}

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            style={{
              background: "var(--bg-card)",
              border: "2px solid var(--border-color)",
              borderRadius: "var(--radius-full)",
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              cursor: "pointer",
              marginLeft: "8px",
            }}
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-nav-btn"
          style={{
            display: "none",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "var(--text-primary)",
          }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mobile-menu"
            style={{
              overflow: "hidden",
              paddingBottom: "16px",
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 16px",
                  textDecoration: "none",
                  color: location.pathname === link.path
                    ? "var(--color-primary)"
                    : "var(--text-secondary)",
                  fontWeight: 700,
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {link.emoji} {link.label}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              style={{
                display: "block",
                width: "100%",
                padding: "12px 16px",
                background: "none",
                border: "none",
                textAlign: "left",
                color: "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
