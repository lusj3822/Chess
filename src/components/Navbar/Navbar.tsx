import './navbar.css';

interface Props {
    playComputer: () => void;
    playMultiplayer: () => void;
}

export default function Navbar({ playComputer, playMultiplayer}: Props) {
    return (
        <nav className="navbar">
                <button className='play-buttons' onClick={() => playMultiplayer()}>Multiplayer</button>
                <button className='play-buttons' onClick={() => playComputer()}>Computer</button>
        </nav>
    );
}