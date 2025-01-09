import './playerbar.css';
import Timer from './Timer';
import { PlayerData } from '../../App';

interface Props {
    className: string;
    playerData: PlayerData;
    gameContext: {
        currentTurn: 'w' | 'b';
        setCurrentTurn: React.Dispatch<React.SetStateAction<'w' | 'b'>>;
        gameState: { 
            checkmate: boolean,
            stalemate: boolean,
            draw: boolean,
            noTime: boolean,
            ongoingGame: boolean
        };
        setGameState: React.Dispatch<React.SetStateAction<{
            checkmate: boolean;
            stalemate: boolean;
            draw: boolean;
            noTime: boolean;
            ongoingGame: boolean
        }>>;
        resetTime: boolean;
        setResetTime: React.Dispatch<React.SetStateAction<boolean>>;
    };
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