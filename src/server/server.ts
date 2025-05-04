import { Server } from "socket.io";
import { Chess } from "chess.js";
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { getUser, createUser } from './database';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173"
    }
  });

app.use(express.json());

app.post("/api/login", async (req: any, res: any) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ 
            success: false,
            error: "Username and password are required" 
        });
    }

    try {
        const user = await getUser(username, password);

        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: "Invalid username or password"
            });
        }

        res.json({ 
            success: true,
            username: user.username
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
});

app.post("/api/register", async (req: any, res: any) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ 
            success: false,
            error: "Username and password are required" 
        });
    }

    try {
        const existingUser = await getUser(username, password);
        
        if (existingUser) {
            return res.status(409).json({ 
                success: false,
                error: "Username already exists" 
            });
        }

        const user = await createUser(username, password);
        
        res.status(201).json({ 
            success: true,
            username: user.username
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
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

        io.to(roomName).emit('user-disconnected');
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});