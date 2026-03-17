// =============================================================================
// Footer Component
// =============================================================================

const Footer = () => {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "24px",
        borderTop: "2px solid var(--border-color)",
        color: "var(--text-muted)",
        fontFamily: "var(--font-body)",
        fontSize: "0.9rem",
        marginTop: "auto",
      }}
    >
      <p>🎮 JavaScript Quiz Challenge — Built with MERN Stack</p>
      <p style={{ marginTop: "4px", fontSize: "0.8rem" }}>
        Made with ❤️ for learning JavaScript
      </p>
    </footer>
  );
};

export default Footer;
