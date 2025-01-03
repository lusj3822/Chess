import { useEffect, useState } from "react";

interface Props {
    active: boolean;
    setGameState: React.Dispatch<React.SetStateAction<{ checkmate: boolean; stalemate: boolean; draw: boolean; noTime: boolean }>>;
    resetTime: boolean;
    setResetTime: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Time {
    minutes: number;
    seconds: number;
  }

export default function Timer({active, setGameState, resetTime, setResetTime}: Props) {
    const [time, setTime] = useState<Time>({ minutes: 1, seconds: 0 });
    useEffect(() => {
        if (resetTime) {
            setResetTime(false);
            setTime({ minutes: 1, seconds: 0 });
            return;
        }
    });

    useEffect(() => {
        if (!active) return;

        const interval = setInterval(() => {
            setTime((prevTime) => {
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
        if (time.minutes === 0 && time.seconds === 0 && active) {
            setGameState({
                checkmate: false,
                stalemate: false,
                draw: false,
                noTime: true,
            });
        }
    }, [time, active, setGameState]);

    function formatTime(): string {
        const { minutes, seconds } = time;
        return seconds < 10 ? `${minutes} : 0${seconds}` : `${minutes} : ${seconds}`;
    }

    return (
        <div className="timer">
            <div className="time">{formatTime()}</div>
        </div>
    );
}