import './App.css';

import Chessboard from './components/Chessboard/Chessboard';
import Playerbar from './components/Playerbar/Playerbar';
import { useState } from 'react';
import { GameState } from './interfaces';

interface Time {
  minutes: number;
  seconds: number;
}

export interface PlayerData {
  image: string;
  userName: string;
  turnStatus: string;
  time: Time;
  setTime: React.Dispatch<React.SetStateAction<Time>>;
}

function App() {
  const [gameState, setGameState] = useState<GameState>({
    checkmate: false,
    stalemate: false,
    draw: false,
    noTime: false,
    ongoingGame: false,
    currentTurn: 'w',
  });
  const [resetTime, setResetTime] = useState<boolean>(false);

  const gameContext = {
    gameState,
    setGameState,
    resetTime,
    setResetTime,
  };

  const [playerTime, setPlayerTime] = useState<Time>({ minutes: 1, seconds: 0 });
  const [opponentPlayerTime, setOpponentPlayerTime] = useState<Time>({ minutes: 1, seconds: 0 });

  const opponentPlayerData: PlayerData = {
    image: "player-icons/opponent.png",
    userName: 'Opponent',
    turnStatus: gameContext.gameState.currentTurn === 'b' ? "Your turn" : "",
    time: opponentPlayerTime,
    setTime: setOpponentPlayerTime,
  };

  const playerData: PlayerData = {
    image: "player-icons/player.png",
    userName: 'Player',
    turnStatus: gameContext.gameState.currentTurn === 'w' ? "Your turn" : "",
    time: playerTime,
    setTime: setPlayerTime,
  };

  return (
    <div>
      <Playerbar className="opponent-player-bar" playerData={opponentPlayerData} gameContext={gameContext} />
      <Chessboard gameContext={gameContext} opponentPlayerData={opponentPlayerData} playerData={playerData}/>
      <Playerbar className="player-bar" playerData={playerData} gameContext={gameContext} />
    </div>
  );
}

export default App