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