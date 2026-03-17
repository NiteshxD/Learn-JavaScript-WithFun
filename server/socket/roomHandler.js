// =============================================================================
// Room Handler — Socket Events for Room Management
// =============================================================================
// Handles: create-room, join-room, leave-room, disconnect
// =============================================================================

const roomManager = require("./RoomManager");

/**
 * Register room-related socket events
 * @param {SocketIO.Server} io — Socket.io server instance
 * @param {SocketIO.Socket} socket — Individual socket connection
 */
module.exports = (io, socket) => {
  // ---- CREATE ROOM ----
  // Host creates a new party room
  socket.on("create-room", ({ username, settings }) => {
    // Validate inputs
    if (!username || !username.trim()) {
      return socket.emit("room-error", { message: "Username is required." });
    }

    const room = roomManager.createRoom(socket.id, username.trim(), settings || {});

    // Join the Socket.io room (for broadcasting)
    socket.join(room.roomId);

    // Send room info back to host
    socket.emit("room-created", {
      roomId: room.roomId,
      players: roomManager.getPlayerList(room.roomId),
      settings: room.settings,
    });
  });

  // ---- JOIN ROOM ----
  // Player joins an existing room by code
  socket.on("join-room", ({ roomId, username }) => {
    if (!username || !username.trim()) {
      return socket.emit("room-error", { message: "Username is required." });
    }
    if (!roomId || !roomId.trim()) {
      return socket.emit("room-error", { message: "Room code is required." });
    }

    const result = roomManager.joinRoom(roomId.toUpperCase(), socket.id, username.trim());

    if (result.error) {
      return socket.emit("room-error", { message: result.error });
    }

    // Join the Socket.io room
    socket.join(roomId.toUpperCase());

    // Tell the joining player the room info
    socket.emit("room-joined", {
      roomId: result.room.roomId,
      players: roomManager.getPlayerList(result.room.roomId),
      settings: result.room.settings,
    });

    // Tell everyone else a new player joined
    socket.to(roomId.toUpperCase()).emit("player-joined", {
      players: roomManager.getPlayerList(result.room.roomId),
    });
  });

  // ---- LEAVE ROOM ----
  // Player voluntarily leaves
  socket.on("leave-room", () => {
    handleLeave(io, socket);
  });

  // ---- DISCONNECT ----
  // Player loses connection
  socket.on("disconnect", () => {
    handleLeave(io, socket);
  });
};

/**
 * Handle a player leaving (voluntary or disconnect)
 */
function handleLeave(io, socket) {
  const roomId = roomManager.getRoomIdBySocket(socket.id);
  if (!roomId) return;

  const result = roomManager.removePlayer(socket.id);
  socket.leave(roomId);

  if (!result) return; // Room was deleted (empty)

  const { room, wasHost } = result;

  // Notify remaining players
  io.to(roomId).emit("player-left", {
    players: roomManager.getPlayerList(roomId),
    newHost: wasHost ? roomManager.getRoom(roomId)?.host : null,
  });
}
