import { ColorType, PieceType, Piece } from "../Chessboard/Chessboard";
export default class Referee {


    isTileEmpty(x: number, y: number, boardState: Piece[]): boolean {
        console.log(boardState);
        const piece = boardState.find((p) => p.x === x && p.y === y);
        return piece === undefined;
    }


    isValidMove(prevX: number, prevY: number, currentX: number, currentY: number, type: PieceType, color: ColorType, boardState: Piece[]) {

        switch(type) {

            case PieceType.PAWN:
                if (prevY === 6) {
                    return ((prevY - currentY) <= 2) && this.isTileEmpty(currentX, currentY, boardState);
                } else {
                    return ((prevY - currentY) === 1) && this.isTileEmpty(currentX, currentY, boardState);
                }
                
            case PieceType.ROOK:
                if (((prevY - currentY) > 1)) {
                    return ((prevX - currentX) === 0) && this.isTileEmpty(currentX, currentY, boardState);
                } else {
                    return ((prevY - currentY) === 0) && this.isTileEmpty(currentX, currentY, boardState);
                }
        }

        return false;
    }
}