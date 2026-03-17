// =============================================================================
// ShareModal Component
// =============================================================================
// Modal overlay for sharing quiz results on social media.
// Generates pre-formatted messages for WhatsApp, Twitter, and LinkedIn.
// =============================================================================

import { motion, AnimatePresence } from "framer-motion";
import { generateShareMessage, getShareUrls } from "../utils/helpers";

/**
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Callback to close the modal
 * @param {number} props.score - Player's score
 * @param {number} props.total - Total questions
 * @param {string} props.difficulty - Difficulty level played
 */
const ShareModal = ({ isOpen, onClose, score, total, difficulty }) => {
  const message = generateShareMessage(score, total, difficulty);
  const urls = getShareUrls(message);

  const platforms = [
    { name: "WhatsApp", emoji: "💬", url: urls.whatsapp, color: "#25D366" },
    { name: "Twitter / X", emoji: "🐦", url: urls.twitter, color: "#1DA1F2" },
    { name: "LinkedIn", emoji: "💼", url: urls.linkedin, color: "#0A66C2" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 100,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              padding: "32px",
              width: "90%",
              maxWidth: "420px",
              zIndex: 101,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              border: "2px solid var(--border-color)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "12px",
                right: "16px",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "var(--text-muted)",
              }}
              aria-label="Close share modal"
            >
              ✕
            </button>

            {/* Title */}
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.6rem",
                textAlign: "center",
                marginBottom: "8px",
                color: "var(--text-primary)",
              }}
            >
              🎉 Share Your Score!
            </h2>

            {/* Message Preview */}
            <p
              style={{
                textAlign: "center",
                padding: "16px",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-secondary)",
                fontStyle: "italic",
                color: "var(--text-secondary)",
                marginBottom: "20px",
                fontSize: "0.9rem",
                fontFamily: "var(--font-body)",
              }}
            >
              "{message}"
            </p>

            {/* Share Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {platforms.map((platform) => (
                <motion.a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    padding: "14px",
                    borderRadius: "var(--radius-md)",
                    background: platform.color,
                    color: "#fff",
                    textDecoration: "none",
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.1rem",
                    transition: "opacity 0.2s",
                  }}
                >
                  <span style={{ fontSize: "1.3rem" }}>{platform.emoji}</span>
                  <span>Share on {platform.name}</span>
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
