import './chessboard.css';
import Tile from '../Tile/Tile';
import { useRef, useState, useEffect } from 'react';
import { Chess, Square, SQUARES } from 'chess.js';

interface Props {
    totalTurns: number;
    setTotalTurns: React.Dispatch<React.SetStateAction<number>>;
}

export default function Chessboard({ totalTurns, setTotalTurns }: Props) {
    const chess = useRef(new Chess());
    const chessboardRef = useRef<HTMLDivElement>(null);

    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [grabSquare, setGrabSquare] = useState<string>("");
    const [chessboardState, setChessboardState] = useState(chess.current.board().flat());
    const [checkmate, setCheckmate] = useState<boolean>(false);

    useEffect(() => {
        setChessboardState(chess.current.board().flat());
    }, [totalTurns]);

    function getPosition(x: number, y: number): string {
        const file = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x];
        return `${file}${8 - y}`;
    }

    function grabPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;

        if (!checkmate && element.classList.contains('chess-piece') && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 75);
            const y = Math.floor((e.clientY - chessboard.offsetTop) / 75);

            setGrabSquare(getPosition(x, y));
            setActivePiece(element);
        }
    }

    function movePiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
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

    function dropPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 75);
            const y = Math.floor((e.clientY - chessboard.offsetTop) / 75);
            const targetSquare = getPosition(x, y);

            try {
                const move = chess.current.move({ from: grabSquare, to: targetSquare });

                if (move) {
                    setTotalTurns((prev) => prev + 1);
                }

                if (chess.current.isCheckmate()) {
                    setCheckmate(true);
                }

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

    function resetBoard() {
        chess.current = new Chess();
        setChessboardState(chess.current.board().flat());
        setTotalTurns(0);
        setCheckmate(false);
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
            <div className='game-over-screen' style={{display: checkmate ? 'block' : 'none'}}>
                <h1>{totalTurns % 2 === 0 ? "White wins" : "Black wins"}</h1>
                <button onClick={resetBoard}>Play again</button>
            </div>
            {SQUARES.map((square, i) => (
                <Tile
                    key={i}
                    number={(i + Math.floor(i / 8)) % 2}
                    image={chessboardState[i] ? `/pieces/${chessboardState[i].color}${chessboardState[i].type}.png` : undefined}
                    highlight={isHighlighted(square)}
                />
            ))}
        </div>
    );
}