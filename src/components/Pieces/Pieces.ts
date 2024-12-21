import { ColorType, PieceType } from "../Chessboard/Chessboard";

export abstract class Piece {
    image: string;
    x: number;
    y: number;
    type: PieceType;
    color: ColorType;

    constructor(image: string, x: number, y:number, type: PieceType, color: ColorType) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
    }

    abstract isValidMove(prevX: number, prevY: number, currentX: number, currentY: number): boolean;

    abstract toString(): string;

}

/*
    isTileEmpty(x: number, y: number, boardState: Piece[]): boolean {
        const piece = boardState.find((p) => p.x === x && p.y === y);
        return piece === undefined;
    }

    tileHasEnemy(x: number, y: number, boardState: Piece[]) {
        const piece = boardState.find((p) => p.x === x && p.y === y);
        if ((piece != undefined) && piece.color === ColorType.BLACK) {
            return true;
        } else {
            return false;
        }
    }
*/

export class Pawn extends Piece {

    constructor(image: string, x: number, y:number, type: PieceType, color: ColorType) {
        super(image, x, y, type, color);
    }

    //console.log("WHITE");
    //return prevY === 6 ? (prevY - currentY) <= 2 : (prevY - currentY) === 1;
    isValidMove(prevX: number, prevY: number, currentX: number, currentY: number): boolean {
        if (this.color === ColorType.WHITE) {
            if (prevY === 6) {
                if (prevX === currentX && (prevY - currentY === 1 || prevY - currentY === 2)) {
                    return true;
                }
            } else {
                if (prevX === currentX && prevY - currentY === 1) {
                    return true;
                }
            }
        }

        if (this.color === ColorType.BLACK) {
            //console.log("BLACK");
            return prevY === 1 ? (currentY - prevY) <= 2 : (currentY - prevY) === 1;
        }
        return false;
    }

    toString(): string {
        return "Pawn";
    }
}

/*
    if (this.color === ColorType.WHITE) {
        console.log("WHITE");
        if (prevY === 6) {
            return ((prevY - currentY) <= 2);
        } else {
            return ((prevY - currentY) === 1);
        }
    }
    console.log("BLACK");
    if (prevY === 1) {
        return ((currentY - prevY) <= 2);
    } else {
        return ((currentY - prevY) === 1);
    }
*/

export class Rook extends Piece {

    constructor(image: string, x: number, y:number, type: PieceType, color: ColorType) {
        super(image, x, y, type, color);
    }

    isValidMove(prevX: number, prevY: number, currentX: number, currentY: number): boolean {
        return false;
    }

    toString(): string {
        return "Rook";
    }
}

export class Knight extends Piece {

    constructor(image: string, x: number, y:number, type: PieceType, color: ColorType) {
        super(image, x, y, type, color);
    }

    isValidMove(prevX: number, prevY: number, currentX: number, currentY: number): boolean {
        return false;
    }

    toString(): string {
        return "Knight";
    }
}

export class Bishop extends Piece {

    constructor(image: string, x: number, y:number, type: PieceType, color: ColorType) {
        super(image, x, y, type, color);
    }

    isValidMove(prevX: number, prevY: number, currentX: number, currentY: number): boolean {
        return false;
    }

    toString(): string {
        return "Bishop";
    }
}

export class Queen extends Piece {

    constructor(image: string, x: number, y:number, type: PieceType, color: ColorType) {
        super(image, x, y, type, color);
    }

    isValidMove(prevX: number, prevY: number, currentX: number, currentY: number): boolean {
        return false;
    }

    toString(): string {
        return "Queen";
    }
}

export class King extends Piece {

    constructor(image: string, x: number, y:number, type: PieceType, color: ColorType) {
        super(image, x, y, type, color);
    }

    isValidMove(prevX: number, prevY: number, currentX: number, currentY: number): boolean {
        return false;
    }

    toString(): string {
        return "King";
    }
}