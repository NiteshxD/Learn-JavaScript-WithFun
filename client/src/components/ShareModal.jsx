// =============================================================================
// ShareModal — Glass share overlay
// =============================================================================

import { motion, AnimatePresence } from "framer-motion";
import { generateShareMessage, getShareUrls } from "../utils/helpers";

const ShareModal = ({ isOpen, onClose, score, total, difficulty }) => {
  const message = generateShareMessage(score, total, difficulty);
  const urls = getShareUrls(message);

  const platforms = [
    { name: "WhatsApp", emoji: "💬", url: urls.whatsapp, gradient: "linear-gradient(135deg, #25D366, #128C7E)" },
    { name: "Twitter / X", emoji: "🐦", url: urls.twitter, gradient: "linear-gradient(135deg, #1DA1F2, #0d8ecf)" },
    { name: "LinkedIn", emoji: "💼", url: urls.linkedin, gradient: "linear-gradient(135deg, #0A66C2, #004182)" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(10, 14, 26, 0.8)", backdropFilter: "blur(8px)", zIndex: 100 }}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              background: "var(--bg-card)", backdropFilter: "blur(20px)",
              borderRadius: "var(--radius-lg)", padding: "32px", width: "90%", maxWidth: "420px",
              zIndex: 101, boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)", border: "1px solid var(--border-color)",
            }}
          >
            <button
              onClick={onClose}
              style={{ position: "absolute", top: "12px", right: "16px", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}
              aria-label="Close share modal"
            >
              ✕
            </button>

            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "0.9rem", letterSpacing: "2px", textAlign: "center", marginBottom: "8px", color: "var(--text-primary)" }}>
              🎉 SHARE YOUR SCORE!
            </h2>

            <p style={{ textAlign: "center", padding: "16px", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", fontStyle: "italic", color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.85rem" }}>
              "{message}"
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {platforms.map((platform) => (
                <motion.a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    padding: "14px", borderRadius: "var(--radius-md)", background: platform.gradient,
                    color: "#fff", textDecoration: "none", fontFamily: "var(--font-heading)",
                    fontSize: "0.75rem", letterSpacing: "1px", transition: "opacity 0.2s",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{platform.emoji}</span>
                  <span>SHARE ON {platform.name.toUpperCase()}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
