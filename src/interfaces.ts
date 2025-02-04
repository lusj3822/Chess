export interface GameState {
    checkmate: boolean, 
    stalemate: boolean, 
    draw: boolean, 
    noTime: boolean, 
    ongoingGame: boolean,
    currentTurn: 'w' | 'b',
};

export interface GameContext {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    resetTime: boolean;
    setResetTime: React.Dispatch<React.SetStateAction<boolean>>;
    playComputer: boolean;
};

export interface Time {
    minutes: number;
    seconds: number;
}
  
export interface PlayerData {
    image: string;
    userName: string;
    turnStatus: string;
    color: 'white' | 'black';
    time: Time;
    setTime: React.Dispatch<React.SetStateAction<Time>>;
}