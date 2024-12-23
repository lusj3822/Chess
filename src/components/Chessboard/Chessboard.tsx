import './chessboard.css';
import Tile from '../Tile/Tile';
import { useRef, useState } from 'react';
import { Piece, Pawn, Rook, Knight, Bishop, Queen, King } from '../Pieces/Pieces';

export enum PieceType {
    PAWN,
    BISHOP,
    KNIGHT,
    ROOK,
    QUEEN,
    KING,
}

export enum ColorType {
    BLACK,
    WHITE,
}

const initial_board_state: Piece[] = [];

for (let i = 0; i < 8; i++) {
    initial_board_state.push(new Pawn("/pieces/bp.png", i, 1, PieceType.PAWN, ColorType.BLACK));
    initial_board_state.push(new Pawn("/pieces/wp.png", i, 6, PieceType.PAWN, ColorType.WHITE));
}

initial_board_state.push(new Rook("/pieces/br.png", 0, 0, PieceType.ROOK, ColorType.BLACK));
initial_board_state.push(new Rook("/pieces/br.png", 7, 0, PieceType.ROOK, ColorType.BLACK));
initial_board_state.push(new Rook("/pieces/wr.png", 0, 7, PieceType.ROOK, ColorType.WHITE));
initial_board_state.push(new Rook("/pieces/wr.png", 7, 7, PieceType.ROOK, ColorType.WHITE));

initial_board_state.push(new Knight("/pieces/bn.png", 1, 0, PieceType.KNIGHT, ColorType.BLACK));
initial_board_state.push(new Knight("/pieces/bn.png", 6, 0, PieceType.KNIGHT, ColorType.BLACK));
initial_board_state.push(new Knight("/pieces/wn.png", 1, 7, PieceType.KNIGHT, ColorType.WHITE));
initial_board_state.push(new Knight("/pieces/wn.png", 6, 7, PieceType.KNIGHT, ColorType.WHITE));

initial_board_state.push(new Bishop("/pieces/bb.png", 2, 0, PieceType.BISHOP, ColorType.BLACK));
initial_board_state.push(new Bishop("/pieces/bb.png", 5, 0, PieceType.BISHOP, ColorType.BLACK));
initial_board_state.push(new Bishop("/pieces/wb.png", 2, 7, PieceType.BISHOP, ColorType.WHITE));
initial_board_state.push(new Bishop("/pieces/wb.png", 5, 7, PieceType.BISHOP, ColorType.WHITE));

initial_board_state.push(new Queen("/pieces/bq.png", 3, 0, PieceType.QUEEN, ColorType.BLACK));
initial_board_state.push(new Queen("/pieces/wq.png", 3, 7, PieceType.QUEEN, ColorType.WHITE));

initial_board_state.push(new King("/pieces/bk.png", 4, 0, PieceType.KING, ColorType.BLACK));
initial_board_state.push(new King("/pieces/wk.png", 4, 7, PieceType.KING, ColorType.WHITE));

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [pieces, setPieces] = useState<Piece[]>(initial_board_state);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);

    const chessboardRef = useRef<HTMLDivElement>(null);

    function grab_piece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;

        if (element.classList.contains('chess-piece') && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 75);
            const y = Math.floor((e.clientY - chessboard.offsetTop) / 75);
            console.log("Previous position " + `${[Math.floor((e.clientX - chessboard.offsetLeft) / 75), Math.floor((e.clientY - chessboard.offsetTop) / 75)]}`);
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 75));
            setGridY(Math.floor((e.clientY - chessboard.offsetTop) / 75));
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
            console.log("Current position: " + `${[x, y]}`);
            setPieces((value) => {
                const pieces = value.map(p => {
                    if (p.x === gridX && p.y === gridY) {
                        if (p.performMove(x, y, value)) {

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
        }
    }

    let board = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let image = undefined;
            pieces.forEach(p => {
                if (p.x === j && p.y === i) {
                    image = p.image;
                }
            });
            board.push(<Tile number={i + j} key={`${i}, ${j}`} image={image}/>)
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