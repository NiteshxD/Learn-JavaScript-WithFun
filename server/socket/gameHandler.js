// =============================================================================
// Game Handler — Socket Events for Gameplay
// =============================================================================
// Handles: start-game, submit-answer
// Server controls: timer, question progression, scoring
//
// GAME FLOW:
//   1. Host emits "start-game"
//   2. Server fetches questions, starts countdown (3-2-1)
//   3. Server sends first question to all players
//   4. Players submit answers, server validates
//   5. After timer OR all answered, server sends next question
//   6. After last question, server sends final rankings
// =============================================================================

const roomManager = require("./RoomManager");

// Time per question in milliseconds
const QUESTION_TIME_MS = 15000; // 15 seconds per question
const COUNTDOWN_MS = 1000; // 1 second per countdown tick
const BETWEEN_QUESTIONS_MS = 2000; // 2 seconds between questions (show correct answer)

/**
 * Register game-related socket events
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 */
module.exports = (io, socket) => {
  // ---- START GAME ----
  // Only the host can start the game
  socket.on("start-game", async () => {
    const roomId = roomManager.getRoomIdBySocket(socket.id);
    if (!roomId) return socket.emit("game-error", { message: "Not in a room." });

    const room = roomManager.getRoom(roomId);
    if (!room) return socket.emit("game-error", { message: "Room not found." });
    if (room.host !== socket.id) {
      return socket.emit("game-error", { message: "Only the host can start the game." });
    }
    if (room.status !== "waiting") {
      return socket.emit("game-error", { message: "Game already started." });
    }
    if (room.players.size < 2) {
      return socket.emit("game-error", { message: "Need at least 2 players to start." });
    }

    // Prepare game — fetch questions from DB
    const result = await roomManager.prepareGame(roomId);
    if (result.error) {
      return socket.emit("game-error", { message: result.error });
    }

    // Start countdown: 3… 2… 1… GO!
    io.to(roomId).emit("game-countdown", { count: 3 });
    setTimeout(() => io.to(roomId).emit("game-countdown", { count: 2 }), COUNTDOWN_MS);
    setTimeout(() => io.to(roomId).emit("game-countdown", { count: 1 }), COUNTDOWN_MS * 2);
    setTimeout(() => {
      io.to(roomId).emit("game-started", {
        totalQuestions: room.questions.length,
        settings: room.settings,
      });
      // Send first question after a brief moment
      sendNextQuestion(io, roomId);
    }, COUNTDOWN_MS * 3);
  });

  // ---- SUBMIT ANSWER ----
  // Player submits their answer for the current question
  socket.on("submit-answer", ({ answer }) => {
    const roomId = roomManager.getRoomIdBySocket(socket.id);
    if (!roomId) return;

    const room = roomManager.getRoom(roomId);
    if (!room || room.status !== "playing") return;

    // Calculate time taken since question was shown
    const timeMs = Date.now() - (room.questionStartTime || Date.now());

    // Server validates the answer
    const result = roomManager.submitAnswer(roomId, socket.id, answer, timeMs);

    if (result.error || result.alreadyAnswered) return;

    // Send result back to the player who submitted
    socket.emit("answer-result", {
      correct: result.correct,
      correctAnswer: result.correctAnswer,
      score: result.score,
    });

    // Send live scores to all players
    io.to(roomId).emit("score-update", {
      scoreboard: roomManager.getScoreboard(roomId),
    });

    // If all players answered, skip the timer and go to next question
    if (roomManager.allPlayersAnswered(roomId)) {
      if (room.timer) {
        clearTimeout(room.timer);
        room.timer = null;
      }
      // Brief pause to show correct answer, then next question
      setTimeout(() => sendNextQuestion(io, roomId), BETWEEN_QUESTIONS_MS);
    }
  });
};

// =============================================================================
// Server-Controlled Question Flow
// =============================================================================

/**
 * Send the next question to all players in a room
 * If no more questions, send game results
 */
function sendNextQuestion(io, roomId) {
  const room = roomManager.getRoom(roomId);
  if (!room) return;

  const questionData = roomManager.nextQuestion(roomId);

  if (!questionData) {
    // Game over — send final results
    const results = roomManager.getFinalResults(roomId);
    io.to(roomId).emit("game-results", results);
    return;
  }

  // Broadcast question to all players (without correct answer)
  io.to(roomId).emit("question", {
    ...questionData,
    timeLimit: QUESTION_TIME_MS,
  });

  // Server-controlled timer — auto-advance after time expires
  room.timer = setTimeout(() => {
    // Mark any players who didn't answer as wrong
    for (const [socketId, player] of room.players) {
      if (player.connected && player.answers.length <= room.currentQuestionIndex) {
        // Auto-submit empty answer (counts as wrong)
        roomManager.submitAnswer(roomId, socketId, "__TIMEOUT__", QUESTION_TIME_MS);
      }
    }

    // Send correct answer reveal to all
    const correctAnswer = room.questions[room.currentQuestionIndex]?.correctAnswer;
    io.to(roomId).emit("time-up", {
      correctAnswer,
      scoreboard: roomManager.getScoreboard(roomId),
    });

    // Brief pause then next question
    setTimeout(() => sendNextQuestion(io, roomId), BETWEEN_QUESTIONS_MS);
  }, QUESTION_TIME_MS);
}
