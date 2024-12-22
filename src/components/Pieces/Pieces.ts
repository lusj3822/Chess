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

    abstract isValidMove(newX: number, newY: number, boardState: Piece[]): boolean;

    takeEnemyPiece(piece: Piece | undefined, boardState: Piece[]): void {
        if (piece) boardState.splice(boardState.indexOf(piece), 1);
    }

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

    isValidVerticalMovement(newX: number, newY: number): boolean {
        if (this.color === ColorType.WHITE) {
            if (this.y === 6) {
                return this.x === newX && (this.y - newY) <= 2;
            } else {
                return this.x === newX && (this.y - newY) === 1;
            }
        }

        if (this.color === ColorType.BLACK) {
            if (this.y === 1) {
                return this.x === newX && (newY - this.y) <= 2;
            } else {
                return this.x === newX && (newY - this.y) === 1;
            }
        }
        return false;
    }

    isValidDiagonalMovement(newX: number, newY: number, boardState: Piece[]): boolean {
        if (this.color === ColorType.WHITE) {
            if (
                (this.y - newY) + (newX - this.x) === 2 ||
                (this.y - newY) + (this.x - newX) === 2 &&
                this.isTileOccupiedByEnemy(newX, newY, boardState)
            ) {
                const piece = boardState.find((p) => p.x === newX && p.y === newY);
                this.takeEnemyPiece(piece, boardState);
                return true;
            }
        }

        if (this.color === ColorType.BLACK) {
            if (
                (newY - this.y) + (newX - this.x) === 2 ||
                (newY - this.y) + (this.x - newX) === 2 &&
                this.isTileOccupiedByEnemy(newX, newY, boardState)
            ) {
                const piece = boardState.find((p) => p.x === newX && p.y === newY);
                this.takeEnemyPiece(piece, boardState);
                return true;
            }
        }
        return false;
    }

    isValidMove(newX: number, newY: number, boardState: Piece[]): boolean {
        return (
            this.isValidDiagonalMovement(newX, newY, boardState) ||
            this.isValidVerticalMovement(newX, newY) &&
            this.isTileEmpty(newX, newY, boardState)
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

    isValidMove(newX: number, newY: number, boardState: Piece[]): boolean {
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

    isValidMove(newX: number, newY: number, boardState: Piece[]): boolean {
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

    isValidMove(newX: number, newY: number, boardState: Piece[]): boolean {
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

    isValidMove(newX: number, newY: number, boardState: Piece[]): boolean {
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

    isValidMove(newX: number, newY: number, boardState: Piece[]): boolean {
        return false;
    }

    toString(): string {
        return "King";
    }
}