import './tile.css';

interface Properties {
    image: string | undefined;
    number: number;
}

export default function Tile({number, image}: Properties) {
    if (number % 2 === 0) {
        return <div className='tile white-tile'><img src={image}></img></div>;
    } else {
        return <div className='tile black-tile'><img src={image}></img></div>;
    }
}