import { ColorType, PieceType, Position } from "../Pieces/types";

export abstract class Piece {
    image: string;
    position: Position;
    type: PieceType;
    color: ColorType;
    validMoves: Position[] = [];

    constructor(image: string, position: Position, type: PieceType, color: ColorType) {
        this.image = image;
        this.position = position;
        this.type = type;
        this.color = color;
    }

    performMove(newPosition: Position, boardState: Piece[]): boolean {
        const valid_collision: boolean = this.isValidCollision(newPosition, boardState);
        if (this.isValidMove(newPosition, boardState) && valid_collision) {
            const piece = boardState.find((p) => p.position.x === newPosition.x && p.position.y === newPosition.y);
            this.takeEnemyPiece(piece, boardState);
            this.updatePosition(newPosition);
            return true;
        }
        return false;
    }

    updatePosition(position: Position): void {
        this.position = {x: position.x, y: position.y};
    }

    isValidCollision(position: Position, boardState: Piece[]): boolean {
        return this.isTileEmpty(position, boardState) || this.isTileOccupiedByEnemy(position, boardState);
    }

    takeEnemyPiece(piece: Piece | undefined, boardState: Piece[]): void {
        if (piece) boardState.splice(boardState.indexOf(piece), 1);
    }

    isTileEmpty(position: Position, boardState: Piece[]): boolean {
        const piece = boardState.find((p) => p.position.x === position.x && p.position.y === position.y);
        return piece === undefined;
    }

    isTileOccupiedByEnemy(position: Position, boardState: Piece[]): boolean {
        const piece = boardState.find((p) => p.position.x === position.x && p.position.y === position.y);
        if (this.color === ColorType.WHITE) {
            return (piece != undefined) && piece.color === ColorType.BLACK;
        }

        if (this.color === ColorType.BLACK) {
            return (piece != undefined) && piece.color === ColorType.WHITE;
        }
        return false;
    }

    isValidMove(newPosition: Position, boardState: Piece[]): boolean {
        this.getValidPositions(boardState);
        if (this.validMoves.some(pos => pos.x === newPosition.x && pos.y === newPosition.y)) {
            this.clearValidPositions();
            return true;
        }
        this.clearValidPositions();
        return false
    }

    clearValidPositions(): void {
        this.validMoves.length = 0;
    }

    abstract getValidPositions(boardState: Piece[]): Position[];
    abstract toString(): string;

}

export class Pawn extends Piece {

    constructor(image: string, position: Position, type: PieceType, color: ColorType) {
        super(image, position, type, color);
    }

    getValidPositions(boardState: Piece[]): Position[] {
        if (this.color === ColorType.WHITE) {
            if (this.isTileOccupiedByEnemy({x: this.position.x - 1, y: this.position.y - 1}, boardState)) {
                this.validMoves.push({x: this.position.x - 1, y: this.position.y - 1})
            }

            if (this.position.y === 6) {
                if (this.isTileEmpty({x: this.position.x, y: this.position.y - 2}, boardState)) {
                    this.validMoves.push({x: this.position.x, y: this.position.y - 2});
                }
            }

            if (this.isTileEmpty({x: this.position.x, y: this.position.y - 1}, boardState)) {
                this.validMoves.push({x: this.position.x, y: this.position.y - 1});
            }
    
            if (this.isTileOccupiedByEnemy({x: this.position.x + 1, y: this.position.y - 1}, boardState)) {
                this.validMoves.push({x: this.position.x + 1, y: this.position.y - 1})
            }
        }

        if (this.color === ColorType.BLACK) {
            if (this.isTileOccupiedByEnemy({x: this.position.x - 1, y: this.position.y + 1}, boardState)) {
                this.validMoves.push({x: this.position.x - 1, y: this.position.y + 1})
            }

            if (this.position.y === 1) {
                if (this.isTileEmpty({x: this.position.x, y: this.position.y + 2}, boardState)) {
                    this.validMoves.push({x: this.position.x, y: this.position.y + 2});
                }
            }
    
            if (this.isTileEmpty({x: this.position.x, y: this.position.y + 1}, boardState)) {
                this.validMoves.push({x: this.position.x, y: this.position.y + 1});
            }
    
            if (this.isTileOccupiedByEnemy({x: this.position.x + 1, y: this.position.y + 1}, boardState)) {
                this.validMoves.push({x: this.position.x + 1, y: this.position.y + 1})
            }
        }

        return this.validMoves;
    }

    toString(): string {
        return "Pawn";
    }
}

export class Rook extends Piece {

    constructor(image: string, position: Position, type: PieceType, color: ColorType) {
        super(image, position, type, color);
    }

    getValidPositions(boardState: Piece[]): Position[] {
        // Upward check
        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x, y: this.position.y - i}, boardState)) {
                this.validMoves.push({x: this.position.x, y: this.position.y - i});
            }
            if (!this.isTileEmpty({x: this.position.x, y: this.position.y - i}, boardState)) {
                break;
            }
        }
        // Right check
        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x + i, y: this.position.y}, boardState)) {
                this.validMoves.push({x: this.position.x + i, y: this.position.y});
            }
            if (!this.isTileEmpty({x: this.position.x + i, y: this.position.y}, boardState)) {
                break;
            }
        }

        // Downward check
        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x, y: this.position.y + i}, boardState)) {
                this.validMoves.push({x: this.position.x, y: this.position.y + i});
            }
            if (!this.isTileEmpty({x: this.position.x, y: this.position.y + i}, boardState)) {
                break;
            }
        }

        // Left check
        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x - i, y: this.position.y}, boardState)) {
                this.validMoves.push({x: this.position.x - i, y: this.position.y});
            }
            if (!this.isValidCollision({x: this.position.x - i, y: this.position.y}, boardState)) {
                break;
            }
        }

        return this.validMoves;
    }

    toString(): string {
        return "Rook";
    }
}

export class Knight extends Piece {

    constructor(image: string, position: Position, type: PieceType, color: ColorType) {
        super(image, position, type, color);
    }

    getValidPositions(boardState: Piece[]): Position[] {
        if (this.isValidCollision({x: this.position.x + 1, y: this.position.y - 2}, boardState)) {
            this.validMoves.push({x: this.position.x + 1, y: this.position.y - 2});
        }

        if (this.isValidCollision({x: this.position.x - 1, y: this.position.y - 2}, boardState)) {
            this.validMoves.push({x: this.position.x - 1, y: this.position.y - 2});
        }

        if (this.isValidCollision({x: this.position.x - 2, y: this.position.y + 1}, boardState)) {
            this.validMoves.push({x: this.position.x - 2, y: this.position.y + 1});
        }
        
        if (this.isValidCollision({x: this.position.x - 2, y: this.position.y - 1}, boardState)) {
            this.validMoves.push({x: this.position.x - 2, y: this.position.y - 1});
        }

        if (this.isValidCollision({x: this.position.x + 2, y: this.position.y - 1}, boardState)) {
            this.validMoves.push({x: this.position.x + 2, y: this.position.y - 1});
        }

        if (this.isValidCollision({x: this.position.x + 2, y: this.position.y + 1}, boardState)) {
            this.validMoves.push({x: this.position.x + 2, y: this.position.y + 1});
        }

        if (this.isValidCollision({x: this.position.x - 1, y: this.position.y + 2}, boardState)) {
            this.validMoves.push({x: this.position.x - 1, y: this.position.y + 2});
        }

        if (this.isValidCollision({x: this.position.x + 1, y: this.position.y + 2}, boardState)) {
            this.validMoves.push({x: this.position.x + 1, y: this.position.y + 2});
        }

        return this.validMoves;
    }

    toString(): string {
        return "Knight";
    }

}

export class Bishop extends Piece {

    constructor(image: string, position: Position, type: PieceType, color: ColorType) {
        super(image, position, type, color);
    }
    
    getValidPositions(boardState: Piece[]): Position[] {
        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x + i, y: this.position.y - i}, boardState)) {
                this.validMoves.push({x: this.position.x + i, y: this.position.y - i});
            }
            if (!this.isTileEmpty({x: this.position.x + i, y: this.position.y - i}, boardState)) break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x - i, y: this.position.y - i}, boardState)) {
                this.validMoves.push({x: this.position.x - i, y: this.position.y - i});
            }
            if (!this.isTileEmpty({x: this.position.x - i, y: this.position.y - i}, boardState)) break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x - i, y: this.position.y + i}, boardState)) {
                this.validMoves.push({x: this.position.x - i, y: this.position.y + i});
            }
            if (!this.isTileEmpty({x: this.position.x - i, y: this.position.y + i}, boardState)) break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x + i, y: this.position.y + i}, boardState)) {
                this.validMoves.push({x: this.position.x + i, y: this.position.y + i});
            }
            if (!this.isTileEmpty({x: this.position.x + i, y: this.position.y + i}, boardState)) break;
        }

        return this.validMoves;
    }

    toString(): string {
        return "Bishop";
    }
}

export class Queen extends Piece {

    constructor(image: string, position: Position, type: PieceType, color: ColorType) {
        super(image, position, type, color);
    }

    getValidPositions(boardState: Piece[]): Position[] {
        // Upward check
        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x, y: this.position.y - i}, boardState)) {
                this.validMoves.push({x: this.position.x, y: this.position.y - i});
            }
            if (!this.isTileEmpty({x: this.position.x, y: this.position.y - i}, boardState)) {
                break;
            }
        }
        // Right check
        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x + i, y: this.position.y}, boardState)) {
                this.validMoves.push({x: this.position.x + i, y: this.position.y});
            }
            if (!this.isTileEmpty({x: this.position.x + i, y: this.position.y}, boardState)) {
                break;
            }
        }

        // Downward check
        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x, y: this.position.y + i}, boardState)) {
                this.validMoves.push({x: this.position.x, y: this.position.y + i});
            }
            if (!this.isTileEmpty({x: this.position.x, y: this.position.y + i}, boardState)) {
                break;
            }
        }

        // Left check
        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x - i, y: this.position.y}, boardState)) {
                this.validMoves.push({x: this.position.x - i, y: this.position.y});
            }
            if (!this.isTileEmpty({x: this.position.x - i, y: this.position.y}, boardState)) {
                break;
            }
        }

        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x + i, y: this.position.y - i}, boardState)) {
                this.validMoves.push({x: this.position.x + i, y: this.position.y - i});
            }
            if (!this.isTileEmpty({x: this.position.x + i, y: this.position.y - i}, boardState)) break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x - i, y: this.position.y - i}, boardState)) {
                this.validMoves.push({x: this.position.x - i, y: this.position.y - i});
            }
            if (!this.isTileEmpty({x: this.position.x - i, y: this.position.y - i}, boardState)) break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x - i, y: this.position.y + i}, boardState)) {
                this.validMoves.push({x: this.position.x - i, y: this.position.y + i});
            }
            if (!this.isTileEmpty({x: this.position.x - i, y: this.position.y + i}, boardState)) break;
        }
        for (let i = 1; i < 8; i++) {
            if (this.isValidCollision({x: this.position.x + i, y: this.position.y + i}, boardState)) {
                this.validMoves.push({x: this.position.x + i, y: this.position.y + i});
            }
            if (!this.isTileEmpty({x: this.position.x + i, y: this.position.y + i}, boardState)) break;
        }

        return this.validMoves;
    }

    toString(): string {
        return "Queen";
    }
}

export class King extends Piece {

    constructor(image: string, position: Position, type: PieceType, color: ColorType) {
        super(image, position, type, color);
    }

    isValidMove(newPosition: Position, boardState: Piece[]): boolean {
        this.getValidPositions(boardState);
        if (this.validMoves.some(pos => pos.x === newPosition.x && pos.y === newPosition.y)) {
            this.clearValidPositions();
            return true;
        }
        this.clearValidPositions();
        return false
    }

    getValidPositions(boardState: Piece[]): Position[] {
        if (this.isValidCollision({x: this.position.x - 1, y: this.position.y - 1}, boardState)) {
            this.validMoves.push({x: this.position.x - 1, y: this.position.y - 1})
        }

        if (this.isValidCollision({x: this.position.x, y: this.position.y - 1}, boardState)) {
            this.validMoves.push({x: this.position.x, y: this.position.y - 1});
        }

        if (this.isValidCollision({x: this.position.x + 1, y: this.position.y - 1}, boardState)) {
            this.validMoves.push({x: this.position.x + 1, y: this.position.y - 1})
        }

        if (this.isValidCollision({x: this.position.x + 1, y: this.position.y}, boardState)) {
            this.validMoves.push({x: this.position.x + 1, y: this.position.y})
        }

        if (this.isValidCollision({x: this.position.x + 1, y: this.position.y + 1}, boardState)) {
            this.validMoves.push({x: this.position.x + 1, y: this.position.y + 1})
        }

        if (this.isValidCollision({x: this.position.x, y: this.position.y + 1}, boardState)) {
            this.validMoves.push({x: this.position.x, y: this.position.y + 1})
        }

        if (this.isValidCollision({x: this.position.x - 1, y: this.position.y}, boardState)) {
            this.validMoves.push({x: this.position.x - 1, y: this.position.y})
        }

        if (this.isValidCollision({x: this.position.x - 1, y: this.position.y + 1}, boardState)) {
            this.validMoves.push({x: this.position.x - 1, y: this.position.y + 1})
        }
        
        return this.validMoves;
    }

    toString(): string {
        return "King";
    }
}