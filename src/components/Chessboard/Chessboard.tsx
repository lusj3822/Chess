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

export interface Position {
    x: number;
    y: number;
}

const initial_board_state: Piece[] = [];

for (let i = 0; i < 8; i++) {
    initial_board_state.push(new Pawn("/pieces/bp.png", {x: i, y: 1}, PieceType.PAWN, ColorType.BLACK));
    initial_board_state.push(new Pawn("/pieces/wp.png", {x: i, y: 6}, PieceType.PAWN, ColorType.WHITE));
}

initial_board_state.push(new Rook("/pieces/br.png", {x: 0, y: 0}, PieceType.ROOK, ColorType.BLACK));
initial_board_state.push(new Rook("/pieces/br.png", {x: 7, y: 0}, PieceType.ROOK, ColorType.BLACK));
initial_board_state.push(new Rook("/pieces/wr.png", {x: 0, y: 7}, PieceType.ROOK, ColorType.WHITE));
initial_board_state.push(new Rook("/pieces/wr.png", {x: 7, y: 7}, PieceType.ROOK, ColorType.WHITE));

initial_board_state.push(new Knight("/pieces/bn.png", {x: 1, y: 0}, PieceType.KNIGHT, ColorType.BLACK));
initial_board_state.push(new Knight("/pieces/bn.png", {x: 6, y: 0}, PieceType.KNIGHT, ColorType.BLACK));
initial_board_state.push(new Knight("/pieces/wn.png", {x: 1, y: 7}, PieceType.KNIGHT, ColorType.WHITE));
initial_board_state.push(new Knight("/pieces/wn.png", {x: 6, y: 7}, PieceType.KNIGHT, ColorType.WHITE));

initial_board_state.push(new Bishop("/pieces/bb.png", {x: 2, y: 0}, PieceType.BISHOP, ColorType.BLACK));
initial_board_state.push(new Bishop("/pieces/bb.png", {x: 5, y: 0}, PieceType.BISHOP, ColorType.BLACK));
initial_board_state.push(new Bishop("/pieces/wb.png", {x: 2, y: 7}, PieceType.BISHOP, ColorType.WHITE));
initial_board_state.push(new Bishop("/pieces/wb.png", {x: 5, y: 7}, PieceType.BISHOP, ColorType.WHITE));

initial_board_state.push(new Queen("/pieces/bq.png", {x: 3, y: 0}, PieceType.QUEEN, ColorType.BLACK));
initial_board_state.push(new Queen("/pieces/wq.png", {x: 3, y: 7}, PieceType.QUEEN, ColorType.WHITE));

initial_board_state.push(new King("/pieces/bk.png", {x: 4, y: 0}, PieceType.KING, ColorType.BLACK));
initial_board_state.push(new King("/pieces/wk.png", {x: 4, y: 7}, PieceType.KING, ColorType.WHITE));

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [pieces, setPieces] = useState<Piece[]>(initial_board_state);
    const [grabPosition, setGrabPosition] = useState<Position>({x: -1, y: -1});

    const chessboardRef = useRef<HTMLDivElement>(null);

    function update_valid_moves() {
        setPieces((currentPieces) => {

            return currentPieces.map((p) => {
                p.possibleMoves = p.getValidPositions(currentPieces);
                return p;
            });
        });
    }

    function clear_valid_moves() {
        setPieces((currentPieces) => {

            return currentPieces.map((p) => {
                if (p.possibleMoves.length > 0) {
                    p.clearValidPositions();
                }
                return p;
            });
        });
    }

    function grab_piece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (activePiece) return;
        update_valid_moves();
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;

        if (!activePiece && element.classList.contains('chess-piece') && chessboard) {
            console.log("Previous position " + `${[Math.floor((e.clientX - chessboard.offsetLeft) / 75), Math.floor((e.clientY - chessboard.offsetTop) / 75)]}`);
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
            console.log("Current position: " + `${[x, y]}`);
            setPieces((value) => {
                const pieces = value.map(p => {
                    if (p.position.x === grabPosition.x && p.position.y === grabPosition.y) {
                        if (p.performMove({x: x, y: y}, value)) {

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
            clear_valid_moves();
        }
    }

    let board = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = pieces.find(p => p && p.position.x === j && p.position.y === i);
            let image = piece ? piece.image : undefined;

            let current_piece = activePiece != null ? pieces.find(p => p.position.x === grabPosition.x && p.position.y === grabPosition.y) : undefined;
            let highlight = current_piece?.possibleMoves ? current_piece.possibleMoves.some(p => p.x === j && p.y === i) : false;

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