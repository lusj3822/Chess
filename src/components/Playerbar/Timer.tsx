import { useEffect } from "react";
import { GameState, PlayerData } from "../../interfaces";

interface Props {
    active: boolean;
    playerData: PlayerData;
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    resetTime: boolean;
    setResetTime: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Timer({active, playerData, gameState, setGameState, resetTime, setResetTime}: Props) {
    useEffect(() => {
        if (resetTime) {
            setResetTime(false);
            playerData.setTime({ minutes: 5, seconds: 0 });
            return;
        }
    });

    useEffect(() => {
        if (!active || !gameState.ongoingGame || gameState.checkmate || gameState.stalemate || gameState.draw || gameState.noTime) return;

        const interval = setInterval(() => {
            playerData.setTime((prevTime) => {
                const { minutes, seconds } = prevTime;

                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(interval);
                        return { minutes: 0, seconds: 0 };
                    }
                    return { minutes: minutes - 1, seconds: 59 };
                }
                return { minutes, seconds: seconds - 1 };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [active]);

    useEffect(() => {
        if (playerData.time.minutes === 0 && playerData.time.seconds === 0 && active) {
            setGameState({
                checkmate: false,
                stalemate: false,
                draw: false,
                noTime: true,
                ongoingGame: false,
                currentTurn: gameState.currentTurn,
            });
        }
    }, [playerData.time, active, setGameState]);

    function formatTime(): string {
        const { minutes, seconds } = playerData.time;
        return seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;
    }

    return (
        <div className="timer" style={{background: gameState.ongoingGame && active ? "#1CAC78" : "white"}}>
            <div className="time">{formatTime()}</div>
        </div>
    );
}