import './tile.css';

interface Props {
    image: string | undefined;
    number: number;
    highlight: boolean;
}

export default function Tile({number, image, highlight}: Props) {

    const className = 
                    ["tile", number % 2 === 0 && "white-tile", 
                    number % 2 !== 0 && "black-tile", 
                    highlight && "highlight"]
                    .filter(Boolean).join(" ");
 
        return (
            <div className={className}>
                {image && <div className='chess-piece' style={{backgroundImage: `url(${image})`}}></div>}
            </div>);
}