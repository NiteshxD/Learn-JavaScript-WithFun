// =============================================================================
// Party Context — Multiplayer State Management
// =============================================================================
// Manages all party/room state: room info, player list, game state,
// questions, and scores. Listens to socket events and mirrors server state.
//
// IMPORTANT: The server is the single source of truth.
// This context mirrors server state, never computes its own scores.
// =============================================================================

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "./SocketContext";

const PartyContext = createContext();

export const PartyProvider = ({ children }) => {
  const { socket } = useSocket();

  // ---- Room State ----
  const [roomId, setRoomId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [settings, setSettings] = useState({ difficulty: "easy", questionCount: 10 });
  const [roomError, setRoomError] = useState(null);

  // ---- Game State ----
  const [gameStatus, setGameStatus] = useState("idle"); // idle | waiting | countdown | playing | finished
  const [countdown, setCountdown] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLimit, setTimeLimit] = useState(15000);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  // ---- Player's Answer State ----
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null); // { correct, correctAnswer, score }
  const [myScore, setMyScore] = useState(0);

  // ---- Scoreboard ----
  const [scoreboard, setScoreboard] = useState([]);
  const [finalResults, setFinalResults] = useState(null);

  // Track the current socket ref to avoid stale closures
  const socketRef = useRef(socket);
  socketRef.current = socket;

  // =========================================================================
  // Socket Event Listeners
  // =========================================================================

  useEffect(() => {
    if (!socket) return;

    // ---- Room Events ----
    socket.on("room-created", ({ roomId, players, settings }) => {
      setRoomId(roomId);
      setPlayers(players);
      setSettings(settings);
      setIsHost(true);
      setGameStatus("waiting");
      setRoomError(null);
    });

    socket.on("room-joined", ({ roomId, players, settings }) => {
      setRoomId(roomId);
      setPlayers(players);
      setSettings(settings);
      setIsHost(false);
      setGameStatus("waiting");
      setRoomError(null);
    });

    socket.on("player-joined", ({ players }) => {
      setPlayers(players);
    });

    socket.on("player-left", ({ players, newHost }) => {
      setPlayers(players);
      // Check if I became the new host
      if (newHost && socket.id === newHost) {
        setIsHost(true);
      }
    });

    socket.on("room-error", ({ message }) => {
      setRoomError(message);
    });

    // ---- Game Events ----
    socket.on("game-countdown", ({ count }) => {
      setGameStatus("countdown");
      setCountdown(count);
    });

    socket.on("game-started", ({ totalQuestions: total, settings: s }) => {
      setTotalQuestions(total);
      setSettings(s);
      setMyScore(0);
      setScoreboard([]);
      setFinalResults(null);
    });

    socket.on("question", ({ index, total, question, options, category, difficulty, timeLimit: tl }) => {
      setGameStatus("playing");
      setCurrentQuestion({ question, options, category, difficulty });
      setQuestionIndex(index);
      setTotalQuestions(total);
      setTimeLimit(tl);
      setQuestionStartTime(Date.now());
      // Reset answer state for new question
      setSelectedAnswer(null);
      setAnswerResult(null);
    });

    socket.on("answer-result", ({ correct, correctAnswer, score }) => {
      setAnswerResult({ correct, correctAnswer });
      setMyScore(score);
    });

    socket.on("score-update", ({ scoreboard: sb }) => {
      setScoreboard(sb);
    });

    socket.on("time-up", ({ correctAnswer, scoreboard: sb }) => {
      // If player didn't answer, show the correct answer
      if (!answerResult) {
        setAnswerResult({ correct: false, correctAnswer });
      }
      setScoreboard(sb);
    });

    socket.on("game-results", (results) => {
      setGameStatus("finished");
      setFinalResults(results);
    });

    socket.on("game-error", ({ message }) => {
      setRoomError(message);
    });

    return () => {
      socket.off("room-created");
      socket.off("room-joined");
      socket.off("player-joined");
      socket.off("player-left");
      socket.off("room-error");
      socket.off("game-countdown");
      socket.off("game-started");
      socket.off("question");
      socket.off("answer-result");
      socket.off("score-update");
      socket.off("time-up");
      socket.off("game-results");
      socket.off("game-error");
    };
  }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

  // =========================================================================
  // Actions (emit to server)
  // =========================================================================

  const createRoom = useCallback((username, settings) => {
    socketRef.current?.emit("create-room", { username, settings });
  }, []);

  const joinRoom = useCallback((roomId, username) => {
    socketRef.current?.emit("join-room", { roomId, username });
  }, []);

  const startGame = useCallback(() => {
    socketRef.current?.emit("start-game");
  }, []);

  const submitAnswer = useCallback((answer) => {
    if (selectedAnswer !== null) return; // Already answered
    setSelectedAnswer(answer);
    socketRef.current?.emit("submit-answer", { answer });
  }, [selectedAnswer]);

  const leaveRoom = useCallback(() => {
    socketRef.current?.emit("leave-room");
    resetParty();
  }, []);

  const resetParty = useCallback(() => {
    setRoomId(null);
    setPlayers([]);
    setIsHost(false);
    setGameStatus("idle");
    setCountdown(null);
    setCurrentQuestion(null);
    setQuestionIndex(0);
    setTotalQuestions(0);
    setSelectedAnswer(null);
    setAnswerResult(null);
    setMyScore(0);
    setScoreboard([]);
    setFinalResults(null);
    setRoomError(null);
  }, []);

  const clearError = useCallback(() => setRoomError(null), []);

  const value = {
    // Room
    roomId, players, isHost, settings, roomError,
    // Game
    gameStatus, countdown, currentQuestion, questionIndex, totalQuestions,
    timeLimit, questionStartTime,
    // Answer
    selectedAnswer, answerResult, myScore,
    // Scoreboard
    scoreboard, finalResults,
    // Actions
    createRoom, joinRoom, startGame, submitAnswer, leaveRoom, resetParty, clearError,
  };

  return <PartyContext.Provider value={value}>{children}</PartyContext.Provider>;
};

export const useParty = () => {
  const context = useContext(PartyContext);
  if (!context) {
    throw new Error("useParty must be used within a PartyProvider");
  }
  return context;
};
