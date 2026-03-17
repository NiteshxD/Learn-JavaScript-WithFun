// =============================================================================
// RoomManager — In-Memory Room Store
// =============================================================================
// Manages all active party rooms. Uses a Map for O(1) lookups.
//
// WHY IN-MEMORY?
//   For a quiz game, rooms are ephemeral (live for minutes, not days).
//   Persisting to MongoDB would add unnecessary latency for real-time ops.
//   If scaling to multiple servers, replace this with Redis.
//
// ANTI-CHEAT:
//   - Server holds correct answers and validates submissions
//   - Scores are computed server-side only
//   - Timer is controlled by server, not clients
// =============================================================================

const Question = require("../models/Question");

class RoomManager {
  constructor() {
    /** @type {Map<string, Room>} */
    this.rooms = new Map();
    /** @type {Map<string, string>} socketId → roomId for fast disconnect lookup */
    this.socketToRoom = new Map();
  }

  // =========================================================================
  // Room CRUD
  // =========================================================================

  /**
   * Generate a unique 6-character room code
   * @returns {string} e.g. "A3X7K9"
   */
  generateRoomCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I/O/0/1 to avoid confusion
    let code;
    do {
      code = "";
      for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }
    } while (this.rooms.has(code)); // Retry on collision
    return code;
  }

  /**
   * Create a new room
   * @param {string} socketId — Host's socket ID
   * @param {string} username — Host's display name
   * @param {Object} settings — { difficulty, questionCount }
   * @returns {Object} The created room
   */
  createRoom(socketId, username, settings) {
    const roomId = this.generateRoomCode();

    const room = {
      roomId,
      host: socketId,
      players: new Map(),
      settings: {
        difficulty: settings.difficulty || "easy",
        questionCount: settings.questionCount || 10,
      },
      questions: [],
      currentQuestionIndex: -1,
      status: "waiting", // waiting | countdown | playing | finished
      timer: null,
      questionStartTime: null,
      createdAt: Date.now(),
    };

    // Add host as first player
    room.players.set(socketId, {
      username,
      score: 0,
      answers: [],
      answerTimes: [],
      connected: true,
    });

    this.rooms.set(roomId, room);
    this.socketToRoom.set(socketId, roomId);

    return room;
  }

  /**
   * Join an existing room
   * @param {string} roomId — Room code
   * @param {string} socketId — Joining player's socket ID
   * @param {string} username — Joining player's display name
   * @returns {Object} { room } or { error }
   */
  joinRoom(roomId, socketId, username) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: "Room not found. Check the code and try again." };
    if (room.status !== "waiting") return { error: "Game already in progress. Cannot join." };
    if (room.players.size >= 8) return { error: "Room is full (max 8 players)." };

    // Check for duplicate username in this room
    for (const [, player] of room.players) {
      if (player.username.toLowerCase() === username.toLowerCase()) {
        return { error: `Username "${username}" is already taken in this room.` };
      }
    }

    room.players.set(socketId, {
      username,
      score: 0,
      answers: [],
      answerTimes: [],
      connected: true,
    });

    this.socketToRoom.set(socketId, roomId);
    return { room };
  }

  /**
   * Remove a player from their room
   * @param {string} socketId
   * @returns {{ room: Object, wasHost: boolean } | null}
   */
  removePlayer(socketId) {
    const roomId = this.socketToRoom.get(socketId);
    if (!roomId) return null;

    const room = this.rooms.get(roomId);
    if (!room) return null;

    const wasHost = room.host === socketId;
    room.players.delete(socketId);
    this.socketToRoom.delete(socketId);

    // If room is empty, clean up
    if (room.players.size === 0) {
      if (room.timer) clearTimeout(room.timer);
      this.rooms.delete(roomId);
      return null;
    }

    // If host left, assign new host
    if (wasHost) {
      const newHostId = room.players.keys().next().value;
      room.host = newHostId;
    }

    return { room, wasHost };
  }

  // =========================================================================
  // Game Logic (Server-Authoritative)
  // =========================================================================

  /**
   * Fetch questions and prepare the room for gameplay
   * @param {string} roomId
   * @returns {Promise<Object>} { room } or { error }
   */
  async prepareGame(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: "Room not found." };

    try {
      // Fetch random questions from MongoDB
      const questions = await Question.aggregate([
        { $match: { difficulty: room.settings.difficulty } },
        { $sample: { size: room.settings.questionCount } },
      ]);

      if (questions.length === 0) {
        return { error: "No questions available for this difficulty." };
      }

      room.questions = questions;
      room.currentQuestionIndex = -1;
      room.status = "countdown";

      // Reset all player scores
      for (const [, player] of room.players) {
        player.score = 0;
        player.answers = [];
        player.answerTimes = [];
      }

      return { room };
    } catch (err) {
      return { error: "Failed to load questions." };
    }
  }

  /**
   * Get the next question (sanitized — no correct answer sent to clients)
   * @param {string} roomId
   * @returns {Object|null} Sanitized question data or null if game over
   */
  nextQuestion(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.currentQuestionIndex++;

    if (room.currentQuestionIndex >= room.questions.length) {
      room.status = "finished";
      return null; // Game over
    }

    room.status = "playing";
    room.questionStartTime = Date.now();

    const q = room.questions[room.currentQuestionIndex];
    // ANTI-CHEAT: Strip correctAnswer before sending to clients
    return {
      index: room.currentQuestionIndex,
      total: room.questions.length,
      question: q.question,
      options: q.options,
      category: q.category,
      difficulty: q.difficulty,
    };
  }

  /**
   * Validate and record a player's answer (SERVER-SIDE SCORING)
   * @param {string} roomId
   * @param {string} socketId
   * @param {string} answer — The option the player selected
   * @param {number} timeMs — Time taken to answer in ms
   * @returns {Object} { correct, score, alreadyAnswered }
   */
  submitAnswer(roomId, socketId, answer, timeMs) {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== "playing") {
      return { error: "Game not in progress." };
    }

    const player = room.players.get(socketId);
    if (!player) return { error: "Player not found." };

    // Prevent answering the same question twice
    if (player.answers.length > room.currentQuestionIndex) {
      return { alreadyAnswered: true, correct: false, score: player.score };
    }

    const correctAnswer = room.questions[room.currentQuestionIndex].correctAnswer;
    const correct = answer === correctAnswer;

    player.answers.push(answer);
    player.answerTimes.push(timeMs);
    if (correct) player.score++;

    return { correct, score: player.score, correctAnswer, alreadyAnswered: false };
  }

  /**
   * Check if all connected players have answered the current question
   * @param {string} roomId
   * @returns {boolean}
   */
  allPlayersAnswered(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const currentIdx = room.currentQuestionIndex;
    for (const [, player] of room.players) {
      if (player.connected && player.answers.length <= currentIdx) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get live scoreboard for a room
   * @param {string} roomId
   * @returns {Array} Sorted player list
   */
  getScoreboard(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return [];

    const players = [];
    for (const [socketId, player] of room.players) {
      const totalTime = player.answerTimes.reduce((sum, t) => sum + t, 0);
      players.push({
        socketId,
        username: player.username,
        score: player.score,
        totalTime,
        accuracy: room.questions.length > 0
          ? Math.round((player.score / Math.max(player.answers.length, 1)) * 100)
          : 0,
        answered: player.answers.length,
        connected: player.connected,
      });
    }

    // Sort by score (desc), then totalTime (asc)
    return players.sort((a, b) => b.score - a.score || a.totalTime - b.totalTime);
  }

  /**
   * Get final results for a completed game
   * @param {string} roomId
   * @returns {Object} { rankings, settings }
   */
  getFinalResults(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const rankings = this.getScoreboard(roomId).map((p, i) => ({
      rank: i + 1,
      username: p.username,
      score: p.score,
      totalQuestions: room.questions.length,
      accuracy: room.questions.length > 0
        ? Math.round((p.score / room.questions.length) * 100)
        : 0,
      totalTime: p.totalTime,
    }));

    return {
      rankings,
      settings: room.settings,
      roomId: room.roomId,
    };
  }

  // =========================================================================
  // Helpers
  // =========================================================================

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  getRoomBySocket(socketId) {
    const roomId = this.socketToRoom.get(socketId);
    return roomId ? this.rooms.get(roomId) : null;
  }

  getRoomIdBySocket(socketId) {
    return this.socketToRoom.get(socketId);
  }

  /**
   * Serialize player list for sending to clients
   */
  getPlayerList(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    const list = [];
    for (const [socketId, player] of room.players) {
      list.push({
        username: player.username,
        isHost: socketId === room.host,
        connected: player.connected,
      });
    }
    return list;
  }
}

module.exports = new RoomManager(); // Singleton
