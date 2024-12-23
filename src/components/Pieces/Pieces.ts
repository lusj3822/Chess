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

    abstract performMove(newX: number, newY: number, boardState: Piece[]): boolean;

    updatePosition(newX: number, newY: number): void {
        this.x = newX;
        this.y = newY;
    }

    isValidCollision(newX: number, newY: number, boardState: Piece[]): boolean {
        return this.isTileEmpty(newX, newY, boardState) || this.isTileOccupiedByEnemy(newX, newY, boardState);
    }

    takeEnemyPiece(piece: Piece | undefined, boardState: Piece[]): void {
        if (piece) boardState.splice(boardState.indexOf(piece), 1);
    }

    isTileEmpty(x: number, y: number, boardState: Piece[]): boolean {
        const piece = boardState.find((p) => p.x === x && p.y === y);
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

    performMove(newX: number, newY: number, boardState: Piece[]): boolean {
        if (this.isValidVerticalMovement(newX, newY, boardState) || this.isValidDiagonalMovement(newX, newY, boardState)) {
            this.updatePosition(newX, newY);
            return true;
        }
        return false;
    }

    isValidVerticalMovement(newX: number, newY: number, boardState: Piece[]): boolean {
        if (!this.isTileEmpty(newX, newY, boardState)) return false;

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
        const isValidYMovement = this.color === ColorType.WHITE ? this.y - newY === 1 : newY - this.y === 1;

        if (
            isValidYMovement && Math.abs(this.x - newX) === 1 &&
            this.isTileOccupiedByEnemy(newX, newY, boardState)
        ) {
            const piece = boardState.find((p) => p.x === newX && p.y === newY);
            this.takeEnemyPiece(piece, boardState);
            return true;
        }
        return false;
    }

    toString(): string {
        return "Pawn";
    }
}

export class Rook extends Piece {

    constructor(image: string, x: number, y:number, type: PieceType, color: ColorType) {
        super(image, x, y, type, color);
    }

    performMove(newX: number, newY: number, boardState: Piece[]): boolean {
        if (this.isValidMove(newX, newY, boardState)) {
            const piece = boardState.find((p) => p.x === newX && p.y === newY);
            this.takeEnemyPiece(piece, boardState);
            this.updatePosition(newX, newY);
            return true;
        }
        return false;
    }

    isValidMove(newX: number, newY: number, boardState: Piece[]): boolean {
        const valid_collision: boolean = this.isValidCollision(newX, newY, boardState);

        if (Math.abs(this.x - newX) === 0 && valid_collision && this.isPathClear(newX, newY, boardState)) return true;
        if (Math.abs(this.y - newY) === 0 && valid_collision && this.isPathClear(newX, newY, boardState)) return true;
        return false;
    }
    
    isPathClear(newX: number, newY: number, boardState: Piece[]) {
        
        // Upward check
        for (let i = newY; i < this.y; i++) {
            if (!this.isTileEmpty(newX, i, boardState)) {
                if (this.isTileOccupiedByEnemy(newX, i, boardState)) return true;
                return false;
            }
        }

        // Downward check
        for (let i = newY; i > this.y; i--) {
            if (!this.isTileEmpty(newX, i, boardState)) {
                if (this.isTileOccupiedByEnemy(newX, i, boardState)) return true;
                return false;
            }
        }

        // Left check
        for (let i = newX; i < this.x; i++) {
            if (!this.isTileEmpty(i, newY, boardState)) {
                if (this.isTileOccupiedByEnemy(i, newY, boardState)) return true;
                return false;
            }
        }

        // Right check
        for (let i = newX; i > this.x; i--) {
            if (!this.isTileEmpty(i, newY, boardState)) {
                if (this.isTileOccupiedByEnemy(i, newY, boardState)) return true;
                return false;
            }
        }
        return true;
    }

    toString(): string {
        return "Rook";
    }
}

export class Knight extends Piece {

    constructor(image: string, x: number, y:number, type: PieceType, color: ColorType) {
        super(image, x, y, type, color);
    }

    performMove(newX: number, newY: number, boardState: Piece[]): boolean {
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

    performMove(newX: number, newY: number, boardState: Piece[]): boolean {
        if (this.isValidMove(newX, newY, boardState)) {
            const piece = boardState.find((p) => p.x === newX && p.y === newY);
            this.takeEnemyPiece(piece, boardState);
            this.updatePosition(newX, newY);
            return true;
        }
        return false;
    }

    isValidMove(newX: number, newY: number, boardState: Piece[]): boolean {
        const valid_collision: boolean = this.isValidCollision(newX, newY, boardState);

        if (Math.abs(this.x - newX) === Math.abs(this.y - newY) && valid_collision && this.isPathClear(newX, newY, boardState)) return true;
        return false;
    }

    isPathClear(newX: number, newY: number, boardState: Piece[]): boolean {
        for (let i = 0; i < 8; i++) {
            if (Math.abs(this.x - newX) === i && Math.abs(this.y - newY) === i) {
                return !this.isTileEmpty(Math.abs(this.x - newX), Math.abs(this.y - newY), boardState);
            }
        }
        return true;
    }

    toString(): string {
        return "Bishop";
    }
}

export class Queen extends Piece {

    constructor(image: string, x: number, y:number, type: PieceType, color: ColorType) {
        super(image, x, y, type, color);
    }

    performMove(newX: number, newY: number, boardState: Piece[]): boolean {
        if (this.isValidMove(newX, newY, boardState)) {
            const piece = boardState.find((p) => p.x === newX && p.y === newY);
            this.takeEnemyPiece(piece, boardState);
            this.updatePosition(newX, newY);
            return true;
        }
        return false;
    }

    isValidMove(newX: number, newY: number, boardState: Piece[]): boolean {
        const valid_collision: boolean = this.isValidCollision(newX, newY, boardState);

        if (Math.abs(this.x - newX) === Math.abs(this.y - newY) && valid_collision) return true;
        if (Math.abs(this.x - newX) === 0 && valid_collision) return true;
        if (Math.abs(this.y - newY) === 0 && valid_collision) return true;
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

    performMove(newX: number, newY: number, boardState: Piece[]): boolean {
        return false;
    }

    toString(): string {
        return "King";
    }
}