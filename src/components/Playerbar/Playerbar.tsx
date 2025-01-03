import './playerbar.css';
import Timer from './Timer';

interface Props {
    className: string;
    image: string;
    userName: string;
    turnStatus: string;
    setGameState: React.Dispatch<React.SetStateAction<{checkmate: boolean; stalemate: boolean; draw: boolean; noTime: boolean }>>;
    resetTime: boolean;
    setResetTime: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Playerbar({className, image, userName, turnStatus, setGameState, resetTime, setResetTime}: Props) {

    return (
        <div className={`${className}`}>
            <div className='user-info'>
                <img src={`${image}`}></img>
                <h2>{`${userName}`}</h2>
                <h3 className={turnStatus === "Your turn" ? "active" : "inactive"}>{`${turnStatus}`}</h3>
                <Timer active={turnStatus === "Your turn"} setGameState={setGameState} resetTime={resetTime} setResetTime={setResetTime}/>
            </div>
        </div>
    )
}