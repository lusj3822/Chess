import './chessboard.css';
import Tile from '../Tile/Tile';
import { useRef, useState, useEffect } from 'react';
import { Chess, Square, SQUARES } from 'chess.js';
import moveSound from "/audio/move.mp3";
import captureSound from "/audio/capture.mp3";
import { GameContext, PlayerData, GameState } from '../../interfaces';

import { socket } from '../../socket';

interface Props {
    gameContext: GameContext;
    opponentPlayerData: PlayerData;
    playerData: PlayerData;
}

async function postChessApi(data = {}) {
    const response = await fetch("https://chess-api.com/v1", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

export default function Chessboard({ gameContext, opponentPlayerData, playerData }: Props) {
    const chess = useRef(new Chess());
    const chessboardRef = useRef<HTMLDivElement>(null);

    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [grabSquare, setGrabSquare] = useState<string>("");
    const [chessboardState, setChessboardState] = useState(chess.current.board().flat());

    useEffect(() => {
        socket.on('game-state', ({ board, fen, gameState, resetTime }: { board: any[][]; fen: string; gameState: GameState, resetTime: boolean }) => {
            chess.current.load(fen);
            setChessboardState(board.flat());
            gameContext.setGameState(gameState);
            gameContext.setResetTime(resetTime);
        })
    }, []);

    async function computerMove() {
        try {
            const data = await postChessApi({ fen: chess.current.fen() });
            const move = chess.current.move({ from: data.from, to: data.to });
            gameContext.setGameState({
                checkmate: chess.current.isCheckmate(),
                stalemate: chess.current.isStalemate(),
                draw: chess.current.isDraw(),
                noTime: false,
                ongoingGame: true,
                currentTurn: chess.current.turn(),
            });
            move.captured ? captureAudio.play() : moveAudio.play();

        } catch (error) {
            console.log(error);
            const moves = chess.current.moves()
            const choosenMove = moves[Math.floor(Math.random() * moves.length)]
            const move = chess.current.move(choosenMove)
            gameContext.setGameState({
                checkmate: chess.current.isCheckmate(),
                stalemate: chess.current.isStalemate(),
                draw: chess.current.isDraw(),
                noTime: false,
                ongoingGame: true,
                currentTurn: chess.current.turn(),
            });
            move.captured ? captureAudio.play() : moveAudio.play();
        }
    }

    useEffect(() => {
        setChessboardState(chess.current.board().flat());
        if (gameContext.playComputer && gameContext.gameState.currentTurn === 'b') {
            setTimeout(() => {
                computerMove();
            }, 1000);
        }
    }, [gameContext.gameState.currentTurn]);

    useEffect(() => {
        const handleMouseUp = () => {
            if (activePiece) {
                activePiece.style.removeProperty('position');
                activePiece.style.removeProperty('top');
                activePiece.style.removeProperty('left');
                setActivePiece(null);
            }
        };
        document.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [activePiece]);

    function getPosition(x: number, y: number): string {
        const file = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x];
        return `${file}${8 - y}`;
    }

    function grabPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        const isGameOver = gameContext.gameState.checkmate ||
                           gameContext.gameState.stalemate ||
                           gameContext.gameState.draw ||
                           gameContext.gameState.noTime;

        if (!isGameOver && chessboard && element.classList.contains(`chess-piece-${playerData.color}`)) {
            if (activePiece) return;
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 75);
            const y = Math.floor((e.clientY - chessboard.offsetTop) / 75);

            setGrabSquare(getPosition(x, y));
            setActivePiece(element);
        }
    }

    function movePiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        if (activePiece && chessboardRef.current) {
            const size_of_half_piece = 37.5;
            const min_x = chessboardRef.current.offsetLeft - size_of_half_piece;
            const min_y = chessboardRef.current.offsetTop - size_of_half_piece;
            const max_x = chessboardRef.current.offsetLeft + chessboardRef.current.clientWidth - size_of_half_piece;
            const max_y = chessboardRef.current.offsetTop + chessboardRef.current.clientHeight - size_of_half_piece;

            const x = e.clientX - 40;
            const y = e.clientY - 50;

            activePiece.style.zIndex = '10';

            if (x < min_x) {
                activePiece.style.left = `${min_x}px`;
            } else if (x > max_x) {
                activePiece.style.left = `${max_x}px`;
            } else {
                activePiece.style.left = `${x}px`;
            }

            if (y < min_y) {
                activePiece.style.top = `${min_y}px`;
            } else if (y > max_y) {
                activePiece.style.top = `${max_y}px`;
            } else {
                activePiece.style.top = `${y}px`;
            }
        }
    }

    const moveAudio = new Audio(moveSound);
    const captureAudio = new Audio(captureSound);

    function dropPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 75);
            const y = Math.floor((e.clientY - chessboard.offsetTop) / 75);
            const targetSquare = getPosition(x, y);

            try {
                const move = chess.current.move({ from: grabSquare, to: targetSquare });

                if (gameContext.playComputer) {
                    gameContext.setGameState({
                        checkmate: chess.current.isCheckmate(),
                        stalemate: chess.current.isStalemate(),
                        draw: chess.current.isDraw(),
                        noTime: false,
                        ongoingGame: true,
                        currentTurn: chess.current.turn(),
                    });
                } else {
                    socket.emit('move-piece', { from: grabSquare, to: targetSquare });
                }
                move.captured ? captureAudio.play() : moveAudio.play();
                
            } catch (error) {
                activePiece.style.removeProperty('position');
                activePiece.style.removeProperty('top');
                activePiece.style.removeProperty('left');
                setActivePiece(null);
            }
            setActivePiece(null);
            setGrabSquare("");
        }
    }

    useEffect(() => {
        if (gameContext.gameState.currentTurn === 'b') {
            let newSeconds = playerData.time.seconds + 3;
        
            if (newSeconds >= 60) {
                const extraMinutes = Math.floor(newSeconds / 60);
                newSeconds = newSeconds % 60;
                const newMinutes = playerData.time.minutes + extraMinutes;
                playerData.setTime({minutes: newMinutes, seconds: newSeconds});
            } else {
                playerData.setTime({minutes: playerData.time.minutes, seconds: newSeconds});
            }
        } else {
            let newSeconds = opponentPlayerData.time.seconds + 3;
        
            if (newSeconds >= 60) {
                const extraMinutes = Math.floor(newSeconds / 60);
                newSeconds = newSeconds % 60;
                const newMinutes = opponentPlayerData.time.minutes + extraMinutes;
                opponentPlayerData.setTime({minutes: newMinutes, seconds: newSeconds});
            } else {
                opponentPlayerData.setTime({minutes: opponentPlayerData.time.minutes, seconds: newSeconds});
            }
        }

    }, [gameContext.gameState.currentTurn])

    useEffect(() => {
        chess.current = new Chess();
        setChessboardState(chess.current.board().flat());
        gameContext.setGameState({
            checkmate: false, 
            stalemate: false, 
            draw: false, 
            noTime: false, 
            ongoingGame: false,
            currentTurn: 'w'
        });
        gameContext.setResetTime(true);
    }, [gameContext.playComputer]);

    function resetGame() {
        if (gameContext.playComputer) {
            chess.current = new Chess();
            setChessboardState(chess.current.board().flat());
            gameContext.setGameState({
                checkmate: false, 
                stalemate: false, 
                draw: false, 
                noTime: false, 
                ongoingGame: false, 
                currentTurn: 'w'
            });
            gameContext.setResetTime(true);
        } else {
            socket.emit('reset-game');
        }
    }

    function isHighlighted(square: string): boolean {
        if (grabSquare) {
            const validMoves = chess.current.moves({ square: grabSquare as Square, verbose: true });
            return validMoves.some((move) => move.to === square);
        }
        return false;
    }

    return (
        <div
            className='chessboard'
            onMouseMove={(e) => movePiece(e)}
            onMouseDown={(e) => grabPiece(e)}
            onMouseUp={(e) => dropPiece(e)}
            ref={chessboardRef}
        >
            <div 
                className="game-over-screen"
                style={{
                    display: gameContext.gameState.checkmate ||
                    gameContext.gameState.stalemate ||
                    gameContext.gameState.draw ||
                    gameContext.gameState.noTime ? 'block' : 'none'
                }}>
                {gameContext.gameState.checkmate && <h1>{gameContext.gameState.currentTurn === "b" ? "White wins by checkmate" : "Black wins by checkmate"}</h1>}
                {gameContext.gameState.stalemate && <h1>Stalemate!</h1>}
                {gameContext.gameState.draw && <h1>Draw!</h1>}
                {gameContext.gameState.noTime && <h1>{gameContext.gameState.currentTurn === "b" ? "White wins on time" : "Black wins on time"}</h1>}
                <button onClick={() => resetGame()}>Play again</button>
            </div>
            <button className='reset-button' onClick={resetGame} style={{display: gameContext.playComputer ? 'block' : 'none'}}>Reset</button>

            {SQUARES.map((square, i) => (
                <Tile
                    key={i}
                    number={(i + Math.floor(i / 8)) % 2}
                    image={chessboardState[i] ? `/pieces/${chessboardState[i].color}${chessboardState[i].type}.png` : undefined}
                    highlight={isHighlighted(square)}
                    check={chess.current.inCheck()}
                    currentTurn={gameContext.gameState.currentTurn}
                    color={chessboardState[i] ? chessboardState[i].color : null}
                />
            ))}
        </div>
    );
}