import './chessboard.css';
import Tile from '../Tile/Tile';
import { useRef, useState } from 'react';
import '../Referee/Referee';
import Referee from '../Referee/Referee';

export interface Piece {
    image: string;
    x: number;
    y: number;
    type: PieceType;
    color: ColorType;
}

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
    initial_board_state.push({image: "/pieces/bp.png", x: i, y: 1, type: PieceType.PAWN, color: ColorType.BLACK});
    initial_board_state.push({image: "/pieces/wp.png", x: i, y: 6, type: PieceType.PAWN, color: ColorType.WHITE});
}

initial_board_state.push({image: "/pieces/br.png", x: 0, y: 0, type: PieceType.ROOK, color: ColorType.BLACK});
initial_board_state.push({image: "/pieces/br.png", x: 7, y: 0, type: PieceType.ROOK, color: ColorType.BLACK});
initial_board_state.push({image: "/pieces/wr.png", x: 0, y: 7, type: PieceType.ROOK, color: ColorType.WHITE});
initial_board_state.push({image: "/pieces/wr.png", x: 7, y: 7, type: PieceType.ROOK, color: ColorType.WHITE});

initial_board_state.push({image: "/pieces/bn.png", x: 1, y: 0, type: PieceType.KNIGHT, color: ColorType.BLACK});
initial_board_state.push({image: "/pieces/bn.png", x: 6, y: 0, type: PieceType.KNIGHT, color: ColorType.BLACK});
initial_board_state.push({image: "/pieces/wn.png", x: 1, y: 7, type: PieceType.KNIGHT, color: ColorType.WHITE});
initial_board_state.push({image: "/pieces/wn.png", x: 6, y: 7, type: PieceType.KNIGHT, color: ColorType.WHITE});

initial_board_state.push({image: "/pieces/bb.png", x: 2, y: 0, type: PieceType.BISHOP, color: ColorType.BLACK});
initial_board_state.push({image: "/pieces/bb.png", x: 5, y: 0, type: PieceType.BISHOP, color: ColorType.BLACK});
initial_board_state.push({image: "/pieces/wb.png", x: 2, y: 7, type: PieceType.BISHOP, color: ColorType.WHITE});
initial_board_state.push({image: "/pieces/wb.png", x: 5, y: 7, type: PieceType.BISHOP, color: ColorType.WHITE});

initial_board_state.push({image: "/pieces/bq.png", x: 3, y: 0, type: PieceType.QUEEN, color: ColorType.BLACK});
initial_board_state.push({image: "/pieces/wq.png", x: 3, y: 7, type: PieceType.QUEEN, color: ColorType.WHITE});

initial_board_state.push({image: "/pieces/bk.png", x: 4, y: 0, type: PieceType.KING, color: ColorType.BLACK});
initial_board_state.push({image: "/pieces/wk.png", x: 4, y: 7, type: PieceType.KING, color: ColorType.WHITE});



export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [pieces, setPieces] = useState<Piece[]>(initial_board_state);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const referee = new Referee();

    const chessboardRef = useRef<HTMLDivElement>(null);

    function grab_piece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        
        if (element.classList.contains('chess-piece') && chessboard) {
            //console.log("Initial pos " + `${[Math.floor((e.clientX - chessboard.offsetLeft) / 75), Math.floor((e.clientY - chessboard.offsetTop) / 75)]}`);
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 75));
            setGridY(Math.floor((e.clientY - chessboard.offsetTop) / 75));
            setActivePiece(element);
        }
    }

    function move_piece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const chessboard = chessboardRef.current;

        if (activePiece && chessboard) {
            const min_x = chessboard.offsetLeft - 37.5;
            const min_y = chessboard.offsetTop - 37.5;
            const max_x = chessboard.offsetLeft + chessboard.clientWidth - 37.5;
            const max_y = chessboard.offsetTop + chessboard.clientHeight - 37.5;

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
            //console.log("End pos " + `${[x, y]}`);
            setPieces((value) => {
                const pieces = value.map(p => {
                    if (p.x === gridX && p.y === gridY) {
                        if (referee.isValidMove(gridX, gridY, x, y, p.type, p.color, value)) {
                            p.x = x;
                            p.y = y;
                        } else {
                            activePiece.style.removeProperty('top');
                            activePiece.style.removeProperty('left');
                        }
                    }
                    return p;
                })
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