import './App.css';

import Chessboard from './components/Chessboard/Chessboard';
import Playerbar from './components/Playerbar/Playerbar';
import { useState } from 'react';

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
  const [currentTurn, setCurrentTurn] = useState<'w' | 'b'>('w');
  const [gameState, setGameState] = useState({
    checkmate: false,
    stalemate: false,
    draw: false,
    noTime: false,
    ongoingGame: false,
  });
  const [resetTime, setResetTime] = useState<boolean>(false);

  const gameContext = {
    currentTurn,
    setCurrentTurn,
    gameState,
    setGameState,
    resetTime,
    setResetTime,
  };

  const [playerTime, setPlayerTime] = useState<Time>({ minutes: 1, seconds: 0 });
  const [opponentPlayerTime, setOpponentPlayerTime] = useState<Time>({ minutes: 1, seconds: 0 });

  let blackTurn = currentTurn === "b" ? "Your turn" : "";
  let whiteTurn = currentTurn === "w" ? "Your turn" : "";

  const opponentPlayerData: PlayerData = {
    image: "player-icons/cat.jpg",
    userName: 'Opponent',
    turnStatus: blackTurn,
    time: opponentPlayerTime,
    setTime: setOpponentPlayerTime,
  };

  const playerData: PlayerData = {
    image: "player-icons/dog.png",
    userName: 'Player',
    turnStatus: whiteTurn,
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