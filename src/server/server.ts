import { Server } from 'socket.io';
import { Chess } from 'chess.js';

const io = new Server(3000, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

let game = new Chess();
const roomName = "chess-room";

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.join(roomName);
    console.log(`Client ${socket.id} joined room ${roomName}`);

    socket.on('move-piece', ({ from, to }: { from: string; to: string }) => {
        try {
            const move = game.move({ from, to });
            if (move) {
                io.to(roomName).emit('game-state', {
                    board: game.board(),
                    fen: game.fen(),
                    gameState: {
                        checkmate: game.isCheckmate(),
                        stalemate: game.isStalemate(),
                        draw: game.isDraw(),
                        noTime: false,
                        ongoingGame: true,
                        currentTurn: game.turn(),
                    },
                });
            } else {
                socket.emit('invalid-move', { message: 'Invalid move' });
            }
        } catch (error) {
            socket.emit('invalid-move', { message: 'Invalid move', error });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        game = new Chess();
        io.to(roomName).emit('game-state', {
            board: game.board(),
            fen: game.fen(),
            gameState: {
                checkmate: false,
                stalemate: false,
                draw: false,
                noTime: false,
                ongoingGame: false,
                currentTurn: 'w',
            },
        });
    });
});
