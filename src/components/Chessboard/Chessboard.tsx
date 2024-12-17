import './chessboard.css';
import Tile from '../Tile/Tile';

interface Piece {
    image: string;
    x: number;
    y: number;
}

const pieces: Piece[] = [];

for (let i = 0; i < 8; i++) {
    pieces.push({image: "/pieces/bp.png", x: i, y: 1});
    pieces.push({image: "/pieces/wp.png", x: i, y: 6});
}

pieces.push({image: "/pieces/br.png", x: 0, y: 0});
pieces.push({image: "/pieces/br.png", x: 7, y: 0});
pieces.push({image: "/pieces/wr.png", x: 0, y: 7});
pieces.push({image: "/pieces/wr.png", x: 7, y: 7});

pieces.push({image: "/pieces/bn.png", x: 1, y: 0});
pieces.push({image: "/pieces/bn.png", x: 6, y: 0});
pieces.push({image: "/pieces/wn.png", x: 1, y: 7});
pieces.push({image: "/pieces/wn.png", x: 6, y: 7});

pieces.push({image: "/pieces/bb.png", x: 2, y: 0});
pieces.push({image: "/pieces/bb.png", x: 5, y: 0});
pieces.push({image: "/pieces/wb.png", x: 2, y: 7});
pieces.push({image: "/pieces/wb.png", x: 5, y: 7});

pieces.push({image: "/pieces/bq.png", x: 3, y: 0});
pieces.push({image: "/pieces/wq.png", x: 3, y: 7});

pieces.push({image: "/pieces/bk.png", x: 4, y: 0});
pieces.push({image: "/pieces/wk.png", x: 4, y: 7});

export default function Chessboard() {
    let board = [];

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let image = undefined;
            pieces.forEach(p => {
                if (p.x === j && p.y === i) {
                    image = p.image;
                }
            });
            board.push(<Tile number={i + j} key={`${i}, ${j}`} image={image}/>)
        }
    }

    return (
        <div className='chessboard'>{board}</div>
    )
}