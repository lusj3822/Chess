import './App.css';

import Chessboard from './components/Chessboard/Chessboard';
import Playerbar from './components/Playerbar/Playerbar';
import { useState } from 'react';

function App() {
  const [currentTurn, setCurrentTurn] = useState<'w' | 'b'>('w');

  let blackTurn = currentTurn === "b" ? "Your turn" : "";
  let whiteTurn = currentTurn === "w" ? "Your turn" : "";

  return (
    <div>
      <Playerbar className='opponent-player-bar' image='dog.png' userName='Opponent' turnStatus={blackTurn}/>
      <Chessboard currentTurn={currentTurn} setCurrentTurn={setCurrentTurn}/>
      <Playerbar className='player-bar' image='cat.jpg' userName='Player' turnStatus={whiteTurn}/>
    </div>
  )
}

export default App