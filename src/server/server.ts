import { Server } from "socket.io";
import { Chess } from "chess.js";

const io = new Server({
    cors: {
        origin: "http://localhost:5173"
    }
});

let game = new Chess();
const roomName = "chess-room";
const playerColors: Record<string, 'white' | 'black'> = {};
let connectedPlayers: string[] = [];

io.on('connection', (socket) => {
    socket.join(roomName);
    console.log(`Client ${socket.id} joined room ${roomName}`);

    const roomSize = io.sockets.adapter.rooms.get(roomName)?.size || 0;
    console.log(`Players in room: ${roomSize}`);
    connectedPlayers.push(socket.id);

    let assignedColor: 'white' | 'black';

    if (!Object.values(playerColors).includes('white')) {
        assignedColor = 'white';
    } else if (!Object.values(playerColors).includes('black')) {
        assignedColor = 'black';
    } else {
        assignedColor = 'black';
    }

    playerColors[socket.id] = assignedColor;
    console.log(`Assigned ${assignedColor} to ${socket.id}`);

    socket.emit('color-assignment', { color: assignedColor });

    if (roomSize === 2) {
        game = new Chess();
    
        const gameState = {
            checkmate: false,
            stalemate: false,
            draw: false,
            noTime: false,
            ongoingGame: true,
            currentTurn: 'w',
        };

        io.to(roomName).emit("game-state", {
            board: game.board(),
            fen: game.fen(),
            gameState,
            resetTime: false,
        });
    
        io.to(roomName).emit("start-game");
    }    

    socket.on('move-piece', ({ from, to }) => {
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
                        ongoingGame: !game.isGameOver(),
                        currentTurn: game.turn(),
                    },
                    resetTime: false,
                });
            } else {
                socket.emit('invalid-move', { message: 'Invalid move' });
            }
        } catch (error) {
            socket.emit('invalid-move', { message: 'Invalid move', error });
        }
    });

    socket.on('reset-game', () => {
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
            resetTime: true,
        });
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);

        delete playerColors[socket.id];
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
            resetTime: true,
        });
    });
});

io.listen(4000);