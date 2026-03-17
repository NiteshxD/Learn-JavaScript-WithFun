// =============================================================================
// Socket.io Entry Point
// =============================================================================
// Initializes Socket.io and registers all event handlers per connection.
// =============================================================================

const roomHandler = require("./roomHandler");
const gameHandler = require("./gameHandler");

/**
 * Initialize Socket.io event handling
 * @param {SocketIO.Server} io
 */
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Player connected: ${socket.id}`);

    // Register event handlers for this socket
    roomHandler(io, socket);
    gameHandler(io, socket);

    // Ping/pong for connection health
    socket.on("ping-server", () => {
      socket.emit("pong-server");
    });
  });
};
