import './App.css';

import Chessboard from './components/Chessboard/Chessboard';
import Playerbar from './components/Playerbar/Playerbar';
import { useState } from 'react';

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

  let blackTurn = currentTurn === "b" ? "Your turn" : "";
  let whiteTurn = currentTurn === "w" ? "Your turn" : "";

  const opponentPlayerData = {
    image: "player-icons/cat.jpg",
    userName: 'Opponent',
    turnStatus: blackTurn,
  };

  const playerData = {
    image: "player-icons/dog.png",
    userName: 'Player',
    turnStatus: whiteTurn,
  };

  return (
    <div>
      <Playerbar className="opponent-player-bar" playerData={opponentPlayerData} gameContext={gameContext} />
      <Chessboard gameContext={gameContext} />
      <Playerbar className="player-bar" playerData={playerData} gameContext={gameContext} />
    </div>
  );
}

export default App