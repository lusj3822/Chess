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

    abstract isValidMove(prevX: number, prevY: number, currentX: number, currentY: number, boardState: Piece[]): boolean;

    isTileEmpty(x:number, y: number, boardState: Piece[]): boolean {
        const piece = boardState.find((p) => p.x === x && p.y === y);
        console.log(piece === undefined);
        return piece === undefined;
    }

    isTileOccupiedByEnemy(x: number, y: number, boardState: Piece[]): boolean {
        const piece = boardState.find((p) => p.x === x && p.y === y);
        if (this.color === ColorType.WHITE) {
            return (piece != undefined) && piece.color === ColorType.BLACK;
        }

        if (this.color === ColorType.BLACK) {
            return (piece != undefined) && piece.color === ColorType.WHITE;
        }
        return false;
    }

    abstract toString(): string;

}

export class Pawn extends Piece {

    constructor(image: string, x: number, y:number, type: PieceType, color: ColorType) {
        super(image, x, y, type, color);
    }

    isValidVerticalMovement(prevX: number, prevY: number, currentX: number, currentY: number): boolean {
        if (this.color === ColorType.WHITE) {
            if (prevY === 6) {
                return prevX === currentX && (prevY - currentY) <= 2;
            } else {
                return prevX === currentX && (prevY - currentY) === 1;
            }
        }

        if (this.color === ColorType.BLACK) {
            if (prevY === 1) {
                return prevX === currentX && (currentY - prevY) <= 2;
            } else {
                return prevX === currentX && (currentY - prevY) === 1;
            }
        }
        return false;
    }

    isValidDiagonalMovement(prevX: number, prevY: number, currentX: number, currentY: number, boardState: Piece[]): boolean {
        if (this.color === ColorType.WHITE) {
            if ((prevY - currentY) + (currentX - prevX) === 2) {
                return this.isTileOccupiedByEnemy(currentX, currentY, boardState);
            } 
            if ((prevY - currentY) + (prevX - currentX) === 2) {
                return this.isTileOccupiedByEnemy(currentX, currentY, boardState);
            }
        }

        if (this.color === ColorType.BLACK) {
            if ((currentY - prevY) + (currentX - prevX) === 2) {
                return this.isTileOccupiedByEnemy(currentX, currentY, boardState);
            } 
            if ((currentY - prevY) + (prevX - currentX) === 2) {
                return this.isTileOccupiedByEnemy(currentX, currentY, boardState);
            }
        }
        return false;
    }

    isValidMove(prevX: number, prevY: number, currentX: number, currentY: number, boardState: Piece[]): boolean {
        return ( 
            this.isValidDiagonalMovement(prevX, prevY, currentX, currentY, boardState) ||
            this.isValidVerticalMovement(prevX, prevY, currentX, currentY) && 
            this.isTileEmpty(currentX, currentY, boardState)
        );
    }

    toString(): string {
        return "Pawn";
    }
}

export class Rook extends Piece {

    constructor(image: string, x: number, y:number, type: PieceType, color: ColorType) {
        super(image, x, y, type, color);
    }

    isValidMove(prevX: number, prevY: number, currentX: number, currentY: number, boardState: Piece[]): boolean {
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

    isValidMove(prevX: number, prevY: number, currentX: number, currentY: number, boardState: Piece[]): boolean {
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

    isValidMove(prevX: number, prevY: number, currentX: number, currentY: number, boardState: Piece[]): boolean {
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

    isValidMove(prevX: number, prevY: number, currentX: number, currentY: number, boardState: Piece[]): boolean {
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

    isValidMove(prevX: number, prevY: number, currentX: number, currentY: number, boardState: Piece[]): boolean {
        return false;
    }

    toString(): string {
        return "King";
    }
}