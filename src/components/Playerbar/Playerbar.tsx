import './playerbar.css';
import Timer from './Timer';
import { PlayerData } from '../../App';
import { GameContext} from '../../interfaces';

interface Props {
    className: string;
    playerData: PlayerData;
    gameContext: GameContext;
}

export default function Playerbar({className, playerData, gameContext}: Props) {

    return (
        <div className={`${className}`}>
            <div className='user-info'>
                <img src={`${playerData.image}`}></img>
                <h2>{`${playerData.userName}`}</h2>
                <Timer
                    active={playerData.turnStatus === "Your turn"}
                    playerData={playerData} 
                    gameState={gameContext.gameState} 
                    setGameState={gameContext.setGameState} 
                    resetTime={gameContext.resetTime} 
                    setResetTime={gameContext.setResetTime}
                />
            </div>
        </div>
    )
}