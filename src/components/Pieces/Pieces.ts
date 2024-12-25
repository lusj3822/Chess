import { ColorType, PieceType, Position } from "../Chessboard/Chessboard";

export abstract class Piece {
    image: string;
    position: Position;
    type: PieceType;
    color: ColorType;

    constructor(image: string, position: Position, type: PieceType, color: ColorType) {
        this.image = image;
        this.position = position;
        this.type = type;
        this.color = color;
    }

    abstract performMove(position: Position, boardState: Piece[]): boolean;

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

    abstract toString(): string;

}

export class Pawn extends Piece {

    constructor(image: string, position: Position, type: PieceType, color: ColorType) {
        super(image, position, type, color);
    }

    performMove(newPosition: Position, boardState: Piece[]): boolean {
        if (this.isValidVerticalMovement(newPosition, boardState) || this.isValidDiagonalMovement(newPosition, boardState)) {
            this.updatePosition(newPosition);
            return true;
        }
        return false;
    }

    isValidVerticalMovement(newPosition: Position, boardState: Piece[]): boolean {
        if (!this.isTileEmpty(newPosition, boardState)) return false;

        if (this.color === ColorType.WHITE) {
            if (this.position.y === 6) {
                return this.position.x === newPosition.x && (this.position.y - newPosition.y) <= 2;
            } else {
                return this.position.x === newPosition.x && (this.position.y - newPosition.y) === 1;
            }
        }

        if (this.color === ColorType.BLACK) {
            if (this.position.y === 1) {
                return this.position.x === newPosition.x && (newPosition.y - this.position.y) <= 2;
            } else {
                return this.position.x === newPosition.x && (newPosition.y - this.position.y) === 1;
            }
        }
        return false;
    }

    isValidDiagonalMovement(newPosition: Position, boardState: Piece[]): boolean {
        const isValidYMovement = this.color === ColorType.WHITE ? this.position.y - newPosition.y === 1 : newPosition.y - this.position.y === 1;

        if (
            isValidYMovement && Math.abs(this.position.x - newPosition.x) === 1 &&
            this.isTileOccupiedByEnemy(newPosition, boardState)
        ) {
            const piece = boardState.find((p) => p.position.x === newPosition.x && p.position.y === newPosition.y);
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

    constructor(image: string, position: Position, type: PieceType, color: ColorType) {
        super(image, position, type, color);
    }

    performMove(newPosition: Position, boardState: Piece[]): boolean {
        if (this.isValidMove(newPosition, boardState)) {
            const piece = boardState.find((p) => p.position.x === newPosition.x && p.position.y === newPosition.y);
            this.takeEnemyPiece(piece, boardState);
            this.updatePosition(newPosition);
            return true;
        }
        return false;
    }

    isValidMove(newPosition: Position, boardState: Piece[]): boolean {
        const valid_collision: boolean = this.isValidCollision(newPosition, boardState);

        if (Math.abs(this.position.x - newPosition.x) === 0 && valid_collision && this.isPathClear(newPosition, boardState)) return true;
        if (Math.abs(this.position.y - newPosition.y) === 0 && valid_collision && this.isPathClear(newPosition, boardState)) return true;
        return false;
    }
    
    isPathClear(newPosition: Position, boardState: Piece[]) {
        
        // Upward check
        for (let i = newPosition.y; i < this.position.y; i++) {
            if (!this.isTileEmpty({x: newPosition.x, y: i}, boardState)) {
                if (this.isTileOccupiedByEnemy({x: newPosition.x, y: i}, boardState)) return true;
                return false;
            }
        }

        // Downward check
        for (let i = newPosition.y; i > this.position.y; i--) {
            if (!this.isTileEmpty({x: newPosition.x, y: i}, boardState)) {
                if (this.isTileOccupiedByEnemy({x: newPosition.x, y: i}, boardState)) return true;
                return false;
            }
        }

        // Left check
        for (let i = newPosition.x; i < this.position.x; i++) {
            if (!this.isTileEmpty({x: i, y: newPosition.y}, boardState)) {
                if (this.isTileOccupiedByEnemy({x: i, y: newPosition.y}, boardState)) return true;
                return false;
            }
        }

        // Right check
        for (let i = newPosition.x; i > this.position.x; i--) {
            if (!this.isTileEmpty({x: i, y: newPosition.y}, boardState)) {
                if (this.isTileOccupiedByEnemy({x: i, y: newPosition.y}, boardState)) return true;
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

    constructor(image: string, position: Position, type: PieceType, color: ColorType) {
        super(image, position, type, color);
    }

    performMove(newPosition: Position, boardState: Piece[]): boolean {
        const valid_collision: boolean = this.isValidCollision(newPosition, boardState);
        if (this.isValidMove(newPosition) && valid_collision) {
            const piece = boardState.find((p) => p.position.x === newPosition.x && p.position.y === newPosition.y);
            this.takeEnemyPiece(piece, boardState);
            this.updatePosition(newPosition);
            return true;
        }
        return false;
    }

    toString(): string {
        return "Knight";
    }


    isValidMove(newPosition: Position): boolean {

        // TOP LINE
        if (this.position.y - newPosition.y === 2) {
            if (newPosition.x - this.position.x === 1) return true;
            if (this.position.x - newPosition.x === 1) return true;
        }

        // RIGHT LINE
        if (newPosition.x - this.position.x === 2) {
            if (newPosition.y - this.position.y === 1) return true;
            if (this.position.y - newPosition.y === 1) return true;
        }

        // LEFT LINE
        if (this.position.x - newPosition.x === 2) {
            if (newPosition.y - this.position.y === 1) return true;
            if (this.position.y - newPosition.y === 1) return true;
        }

        // BOTTOM LINE
        if (newPosition.y - this.position.y === 2) {
            if (newPosition.x - this.position.x === 1) return true;
            if (this.position.x - newPosition.x === 1) return true;
        }

        return false;
    }

}

export class Bishop extends Piece {

    constructor(image: string, position: Position, type: PieceType, color: ColorType) {
        super(image, position, type, color);
    }
    

    performMove(newPosition: Position, boardState: Piece[]): boolean {
        if (this.isValidMove(newPosition, boardState)) {
            const piece = boardState.find((p) => p.position.x === newPosition.x && p.position.y === newPosition.y);
            this.takeEnemyPiece(piece, boardState);
            this.updatePosition(newPosition);
            return true;
        }
        return false;
    }

    isValidMove(newPosition: Position, boardState: Piece[]): boolean {
        const valid_collision: boolean = this.isValidCollision(newPosition, boardState);

        if (Math.abs(this.position.x - newPosition.x) === Math.abs(this.position.y - newPosition.y) && valid_collision && this.isPathClear(newPosition, boardState)) return true;
        return false;
    }

    isPathClear(newPosition: Position, boardState: Piece[]): boolean {
        for (let i = 1; i < 8; i++) {

            // Up right movement
            if (newPosition.x - this.position.x > i && this.position.y - newPosition.y > i) {
                if (!this.isTileEmpty({x: this.position.x + i, y: this.position.y - i}, boardState)) {
                    return false;
                }
            }
            
            // Up left movement
            if (this.position.x - newPosition.x > i && this.position.y - newPosition.y > i) {
                if (!this.isTileEmpty({x: this.position.x - i, y: this.position.y - i}, boardState)) {
                    return false;
                }
            }

            // Down right movement
            if (newPosition.x - this.position.x > i && newPosition.y - this.position.y > i) {
                if (!this.isTileEmpty({x: this.position.x + i, y: this.position.y + i}, boardState)) {
                    return false;
                }
            }

            // Down left movement
            if (this.position.x - newPosition.x > i && newPosition.y - this.position.y > i) {
                if (!this.isTileEmpty({x: this.position.x - i, y: this.position.y + i}, boardState)) {
                    return false;
                }
            }
        }
        return true;
    }

    toString(): string {
        return "Bishop";
    }
}

export class Queen extends Piece {

    constructor(image: string, position: Position, type: PieceType, color: ColorType) {
        super(image, position, type, color);
    }

    performMove(newPosition: Position, boardState: Piece[]): boolean {
        if (this.isValidMove(newPosition, boardState)) {
            const piece = boardState.find((p) => p.position.x === newPosition.x && p.position.y === newPosition.y);
            this.takeEnemyPiece(piece, boardState);
            this.updatePosition(newPosition);
            return true;
        }
        return false;
    }

    isValidMove(newPosition: Position, boardState: Piece[]): boolean {
        const valid_collision: boolean = this.isValidCollision(newPosition, boardState);

        if (Math.abs(this.position.x - newPosition.x) === Math.abs(this.position.y - newPosition.y) && valid_collision && this.isPathClear(newPosition, boardState)) return true;
        if (Math.abs(this.position.x - newPosition.x) === 0 && valid_collision && this.isPathClear(newPosition, boardState)) return true;
        if (Math.abs(this.position.y - newPosition.y) === 0 && valid_collision && this.isPathClear(newPosition, boardState)) return true;
        return false;
    }

    isPathClear(newPosition: Position, boardState: Piece[]): boolean {
        for (let i = 1; i < 8; i++) {

            // Up right movement
            if (newPosition.x - this.position.x > i && this.position.y - newPosition.y > i) {
                if (!this.isTileEmpty({x: this.position.x + i, y: this.position.y - i}, boardState)) {
                    return false;
                }
            }
            
            // Up left movement
            if (this.position.x - newPosition.x > i && this.position.y - newPosition.y > i) {
                if (!this.isTileEmpty({x: this.position.x - i, y: this.position.y - i}, boardState)) {
                    return false;
                }
            }

            // Down right movement
            if (newPosition.x - this.position.x > i && newPosition.y - this.position.y > i) {
                if (!this.isTileEmpty({x: this.position.x + i, y: this.position.y + i}, boardState)) {
                    return false;
                }
            }

            // Down left movement
            if (this.position.x - newPosition.x > i && newPosition.y - this.position.y > i) {
                if (!this.isTileEmpty({x: this.position.x - i, y: this.position.y + i}, boardState)) {
                    return false;
                }
            }
        }

        // Upward check
        for (let i = newPosition.y; i < this.position.y; i++) {
            if (!this.isTileEmpty({x: newPosition.x, y: i}, boardState)) {
                if (this.isTileOccupiedByEnemy({x: newPosition.x, y: i}, boardState)) return true;
                return false;
            }
        }

        // Downward check
        for (let i = newPosition.y; i > this.position.y; i--) {
            if (!this.isTileEmpty({x: newPosition.x, y: i}, boardState)) {
                if (this.isTileOccupiedByEnemy({x: newPosition.x, y: i}, boardState)) return true;
                return false;
            }
        }

        // Left check
        for (let i = newPosition.x; i < this.position.x; i++) {
            if (!this.isTileEmpty({x: i, y: newPosition.y}, boardState)) {
                if (this.isTileOccupiedByEnemy({x: i, y: newPosition.y}, boardState)) return true;
                return false;
            }
        }

        // Right check
        for (let i = newPosition.x; i > this.position.x; i--) {
            if (!this.isTileEmpty({x: i, y: newPosition.y}, boardState)) {
                if (this.isTileOccupiedByEnemy({x: i, y: newPosition.y}, boardState)) return true;
                return false;
            }
        }
        return true;
    }

    toString(): string {
        return "Queen";
    }
}

export class King extends Piece {

    constructor(image: string, position: Position, type: PieceType, color: ColorType) {
        super(image, position, type, color);
    }

    performMove(newPosition: Position, boardState: Piece[]): boolean {
        if (this.isValidMove(newPosition, boardState)) {
            const piece = boardState.find((p) => p.position.x === newPosition.x && p.position.y === newPosition.y);
            this.takeEnemyPiece(piece, boardState);
            this.updatePosition(newPosition);
            return true;
        }
        return false;
    }

    isValidMove(newPosition: Position, boardState: Piece[]): boolean {
        const valid_collision: boolean = this.isValidCollision(newPosition, boardState);

        if (Math.abs(this.position.x - newPosition.x) === 1 && Math.abs(this.position.y - newPosition.y) === 1 && valid_collision) return true;
        if (this.position.y === newPosition.y && Math.abs(this.position.x - newPosition.x) === 1 && valid_collision) return true;
        if (this.position.x === newPosition.x && Math.abs(this.position.y - newPosition.y) === 1 && valid_collision) return true;
        return false;
    }

    toString(): string {
        return "King";
    }
}