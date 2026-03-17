// =============================================================================
// Footer — Minimal gaming footer
// =============================================================================

const Footer = () => {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "24px",
        borderTop: "1px solid var(--border-color)",
        color: "var(--text-muted)",
        fontFamily: "var(--font-body)",
        fontSize: "0.85rem",
        marginTop: "auto",
        background: "rgba(10, 14, 26, 0.5)",
        backdropFilter: "blur(10px)",
      }}
    >
      <p style={{ fontWeight: 600 }}>
        🎮 <span style={{ color: "var(--color-primary)", fontFamily: "var(--font-heading)", fontSize: "0.75rem", letterSpacing: "1px" }}>JS QUIZ CHALLENGE</span> — Built with MERN Stack
      </p>
      <p style={{ marginTop: "4px", fontSize: "0.75rem" }}>
        Made with ❤️ for learning JavaScript
      </p>
    </footer>
  );
};

export default Footer;
