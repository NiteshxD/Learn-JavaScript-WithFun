// =============================================================================
// Constants
// =============================================================================
// Centralized constants prevent magic numbers/strings scattered across the app.
// If a value changes (e.g., total questions), it only needs updating here.
// =============================================================================

/** Default number of questions per quiz session */
export const TOTAL_QUESTIONS = 10;

/** Available question count options */
export const QUESTION_COUNTS = [10, 25, 50];

/** Available difficulty levels */
export const DIFFICULTIES = [
  {
    id: "easy",
    label: "Easy",
    emoji: "🌱",
    description: "Perfect for beginners",
    color: "var(--color-primary)",
    gradient: "linear-gradient(135deg, #4ade80, #22c55e)",
  },
  {
    id: "medium",
    label: "Medium",
    emoji: "⚡",
    description: "For intermediate learners",
    color: "var(--color-secondary)",
    gradient: "linear-gradient(135deg, #fb923c, #ea580c)",
  },
  {
    id: "hard",
    label: "Hard",
    emoji: "🔥",
    description: "Challenge yourself!",
    color: "var(--color-accent)",
    gradient: "linear-gradient(135deg, #a78bfa, #7c3aed)",
  },
];

/** Navigation menu items */
export const NAV_LINKS = [
  { path: "/", label: "Home", emoji: "🏠" },
  { path: "/party", label: "Party", emoji: "🎉" },
  { path: "/leaderboard", label: "Leaderboard", emoji: "🏆" },
  { path: "/about", label: "About", emoji: "ℹ️" },
];

/** Streak milestones for special celebrations */
export const STREAK_MILESTONES = [3, 5, 7, 10, 15, 20];

/** Motivational messages for streaks */
export const STREAK_MESSAGES = {
  3: "Nice streak! 🎯",
  5: "On fire! 🔥🔥",
  7: "Unstoppable! 💪",
  10: "LEGENDARY! 🏆✨",
  15: "GODLIKE! 👑🌟",
  20: "IMPOSSIBLE! 🤯🚀",
};
