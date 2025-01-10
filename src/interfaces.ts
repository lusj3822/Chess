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
};