import './tile.css';

interface Props {
    image: string | undefined;
    number: number;
    highlight: boolean;
    check: boolean;
    currentTurn: 'w' | 'b';
}

export default function Tile({number, image, highlight, check, currentTurn}: Props) {

    let king;
    currentTurn === 'w' ? king = image === `/pieces/wk.png` : king = image === `/pieces/bk.png`

    const className = 
                    ["tile", number % 2 === 0 && "white-tile", 
                    number % 2 !== 0 && "black-tile", 
                    highlight && "highlight"]
                    .filter(Boolean).join(" ");
 
        return (
            <div className={className} style={{backgroundColor: king && check ? 'red' : ''}}>
                {image && <div className='chess-piece' style={{backgroundImage: `url(${image})`}}></div>}
            </div>);
}