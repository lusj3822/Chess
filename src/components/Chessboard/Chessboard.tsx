import './chessboard.css';
import Tile from '../Tile/Tile';
import { useRef, useState, useEffect } from 'react';
import { Chess, Square, SQUARES } from 'chess.js';
import { PlayerData } from "../../App";
import moveSound from "../../../public/audio/move.mp3";
import captureSound from "../../../public/audio/capture.mp3";

interface Props {
    gameContext: {
        currentTurn: 'w' | 'b';
        setCurrentTurn: React.Dispatch<React.SetStateAction<'w' | 'b'>>;
        gameState: { 
            checkmate: boolean, 
            stalemate: boolean, 
            draw: boolean, 
            noTime: boolean, 
            ongoingGame: boolean
        };
        setGameState: React.Dispatch<React.SetStateAction<{
            checkmate: boolean; 
            stalemate: boolean; 
            draw: boolean; 
            noTime: boolean, 
            ongoingGame: boolean
        }>>;
        resetTime: boolean;
        setResetTime: React.Dispatch<React.SetStateAction<boolean>>;
      };
    opponentPlayerData: PlayerData;
    playerData: PlayerData;
}

export default function Chessboard({ gameContext, opponentPlayerData, playerData }: Props) {
    const chess = useRef(new Chess());
    const chessboardRef = useRef<HTMLDivElement>(null);

    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [grabSquare, setGrabSquare] = useState<string>("");
    const [chessboardState, setChessboardState] = useState(chess.current.board().flat());

    useEffect(() => {
        setChessboardState(chess.current.board().flat());
    }, [gameContext.currentTurn]);

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

        if (!isGameOver && element.classList.contains('chess-piece') && chessboard) {
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

    function incrementPlayerTime() {
        if (gameContext.gameState.ongoingGame) {
            if (playerData.turnStatus === "Your turn") {
                let newSeconds = playerData.time.seconds + 3;
        
                if (newSeconds >= 60) {
                    const extraMinutes = Math.floor(newSeconds / 60);
                    newSeconds = newSeconds % 60;
                    const newMinutes = playerData.time.minutes + extraMinutes;
                    playerData.setTime({minutes: newMinutes, seconds: newSeconds});
                } else {
                    playerData.setTime({minutes: playerData.time.minutes, seconds: newSeconds});
                }
        
            } else if (opponentPlayerData.turnStatus === "Your turn") {
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

                if (move) {
                    gameContext.setCurrentTurn((turn) => turn === "w" ? "b" : "w");
                }

                gameContext.setGameState({
                    checkmate: chess.current.isCheckmate(),
                    stalemate: chess.current.isStalemate(),
                    draw: chess.current.isDraw(),
                    noTime: false,
                    ongoingGame: true,
                });

                incrementPlayerTime();
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

    function resetBoard(): void {
        chess.current = new Chess();
        setChessboardState(chess.current.board().flat());
        gameContext.setCurrentTurn("w");
        gameContext.setGameState({checkmate: false, stalemate: false, draw: false, noTime: false, ongoingGame: false});
        gameContext.setResetTime(true);
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
                {gameContext.gameState.checkmate && <h1>{gameContext.currentTurn === "b" ? "White wins by checkmate" : "Black wins by checkmate"}</h1>}
                {gameContext.gameState.stalemate && <h1>Stalemate!</h1>}
                {gameContext.gameState.draw && <h1>Draw!</h1>}
                {gameContext.gameState.noTime && <h1>{gameContext.currentTurn === "b" ? "White wins on time" : "Black wins on time"}</h1>}
                <button onClick={resetBoard}>Play again</button>
            </div>

            {SQUARES.map((square, i) => (
                <Tile
                    key={i}
                    number={(i + Math.floor(i / 8)) % 2}
                    image={chessboardState[i] ? `/pieces/${chessboardState[i].color}${chessboardState[i].type}.png` : undefined}
                    highlight={isHighlighted(square)}
                    check={chess.current.inCheck()}
                    currentTurn={gameContext.currentTurn}
                />
            ))}
        </div>
    );
}