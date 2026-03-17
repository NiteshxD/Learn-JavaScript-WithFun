// =============================================================================
// Navbar — Futuristic Gaming Navigation
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
        background: "rgba(10, 14, 26, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-color)",
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
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontFamily: "var(--font-heading)",
              fontSize: "1.1rem",
              fontWeight: 800,
              letterSpacing: "2px",
            }}
          >
            <span style={{ fontSize: "1.6rem" }}>🎮</span>
            <span
              style={{
                background: "linear-gradient(135deg, var(--color-primary), var(--color-sky))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              JS QUIZ
            </span>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
          className="desktop-nav"
        >
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "var(--radius-full)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    letterSpacing: "0.3px",
                    color: isActive ? "#0a0e1a" : "var(--text-secondary)",
                    background: isActive
                      ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))"
                      : "transparent",
                    boxShadow: isActive ? "var(--shadow-glow-green)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {link.emoji} {link.label}
                </motion.div>
              </Link>
            );
          })}

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            style={{
              background: "var(--bg-glass)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-full)",
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              cursor: "pointer",
              marginLeft: "8px",
              backdropFilter: "blur(10px)",
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
              borderTop: "1px solid var(--border-color)",
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
    </nav>
  );
};

export default Navbar;
