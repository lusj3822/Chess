import { Piece, Pawn, Rook, Knight, Bishop, Queen, King } from '../Pieces/Pieces';
import { PieceType, ColorType } from './types';

export const initial_board_state: Piece[] = [];

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