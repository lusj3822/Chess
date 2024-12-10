import './chessboard.css'

function generate_board() {
    let board = [];
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 == 0) {
                board.push(<div className='white-tile'></div>);
            } else {
                board.push(<div className='black-tile'></div>);
            }
        }
    }
    return board;
}

export default function Chessboard() {

    return (
        <div className='chessboard'>
            {generate_board()}
        </div>
    )
}