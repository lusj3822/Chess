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
  });
  const [resetTime, setResetTime] = useState<boolean>(false);

  let blackTurn = currentTurn === "b" ? "Your turn" : "";
  let whiteTurn = currentTurn === "w" ? "Your turn" : "";

  return (
    <div>
      <Playerbar className='opponent-player-bar' image='dog.png' userName='Opponent' turnStatus={blackTurn} setGameState={setGameState} resetTime={resetTime} setResetTime={setResetTime}/>
      <Chessboard currentTurn={currentTurn} setCurrentTurn={setCurrentTurn} gameState={gameState} setGameState={setGameState} setResetTime={setResetTime}/>
      <Playerbar className='player-bar' image='cat.jpg' userName='Player' turnStatus={whiteTurn} setGameState={setGameState} resetTime={resetTime} setResetTime={setResetTime}/>
    </div>
  )
}

export default App