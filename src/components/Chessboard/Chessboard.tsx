import './chessboard.css';
import Tile from '../Tile/Tile';
import { useRef, useState } from 'react';
import { Piece } from '../Pieces/Pieces';
import { initial_board_state } from '../Pieces/constants';
import { Position, ColorType } from '../Pieces/types';

interface Props {
    totalTurns: number;
    setTotalTurns: React.Dispatch<React.SetStateAction<number>>;
}

export default function Chessboard({totalTurns, setTotalTurns}: Props) {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [pieces, setPieces] = useState<Piece[]>(initial_board_state);
    const [grabPosition, setGrabPosition] = useState<Position>({x: -1, y: -1});

    const chessboardRef = useRef<HTMLDivElement>(null);

    function updateValidMoves(): void {
        for (const piece of pieces) {
            piece.getValidPositions(pieces);
        }
    }

    function clearValidMoves() {
        for (const piece of pieces) {
            piece.clearValidPositions();
        }
    }

    function grab_piece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (activePiece) return;
        updateValidMoves();
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;

        if (!activePiece && element.classList.contains('chess-piece') && chessboard) {
            const grab_x = Math.floor((e.clientX - chessboard.offsetLeft) / 75);
            const grab_y = Math.floor((e.clientY - chessboard.offsetTop) / 75);
            setGrabPosition({x: grab_x, y: grab_y});
            setActivePiece(element);
        }
    }

    function move_piece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const chessboard = chessboardRef.current;

        if (activePiece && chessboard) {
            const size_of_half_piece = 37.5;
            const min_x = chessboard.offsetLeft - size_of_half_piece;
            const min_y = chessboard.offsetTop - size_of_half_piece;
            const max_x = chessboard.offsetLeft + chessboard.clientWidth - size_of_half_piece;
            const max_y = chessboard.offsetTop + chessboard.clientHeight - size_of_half_piece;

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

    function drop_piece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const chessboard = chessboardRef.current;

        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 75);
            const y = Math.floor((e.clientY - chessboard.offsetTop) / 75);
            console.log(totalTurns);
            setPieces((value) => {
                const pieces = value.map(p => {
                    if (p.position.x === grabPosition.x && p.position.y === grabPosition.y) {
                        if (p.color === ColorType.WHITE && totalTurns % 2 !== 0) {
                            if (p.performMove({x: x, y: y}, value)) {
                                setTimeout(() => {
                                    setTotalTurns(totalTurns + 1);
                                }, 0);
                            } else {
                                activePiece.style.removeProperty('top');
                                activePiece.style.removeProperty('left');
                            }

                        } else {
                            activePiece.style.removeProperty('top');
                            activePiece.style.removeProperty('left');
                        }

                        if (p.color === ColorType.BLACK && totalTurns % 2 === 0) {
                            if (p.performMove({x: x, y: y}, value)) {
                                setTimeout(() => {
                                    setTotalTurns(totalTurns + 1);
                                }, 0);
                            } else {
                                activePiece.style.removeProperty('top');
                                activePiece.style.removeProperty('left');
                            }
                        } else {
                            activePiece.style.removeProperty('top');
                            activePiece.style.removeProperty('left');
                        }
                    }
                    return p;
                });
                return pieces;
            });
            setActivePiece(null);
            clearValidMoves();
        }
    }

    let board = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = pieces.find(p => p && p.position.x === j && p.position.y === i);
            let image = piece ? piece.image : undefined;

            let current_piece = activePiece != null ? pieces.find(p => p.position.x === grabPosition.x && p.position.y === grabPosition.y) : undefined;
            let highlight = current_piece?.validMoves ? current_piece.validMoves.some(p => p.x === j && p.y === i) : false;

            board.push(<Tile number={i + j} key={`${i}, ${j}`} image={image} highlight={highlight}/>)
        }
    }

    return (
        <div 
            className='chessboard' 
            onMouseMove={(e) => move_piece(e)} 
            onMouseDown={(e) => grab_piece(e)} 
            onMouseUp={(e) => drop_piece(e)}
            ref={chessboardRef}
        >
            {board}
        </div>
    )
}