import './App.css';

import Chessboard from './components/Chessboard/Chessboard';
import Playerbar from './components/Playerbar/Playerbar';
import { useState } from 'react';

function App() {
  const [totalTurns, setTotalTurns] = useState<number>(1);

  let blackTurn;
  if (totalTurns % 2 === 0) {
    blackTurn = "Your turn";
  } else {
    blackTurn = "Opponents turn";
  }

  let whiteTurn;
  if (totalTurns % 2 !== 0) {
    whiteTurn = "Your turn";
  } else {
    whiteTurn = "Opponents turn";
  }

  return (
    <div>
      <Playerbar className='opponent-player-bar' image='dog.png' userName='Opponent' turnStatus={blackTurn}/>
      <Chessboard totalTurns={totalTurns} setTotalTurns={setTotalTurns}/>
      <Playerbar className='player-bar' image='cat.jpg' userName='Player' turnStatus={whiteTurn}/>
    </div>
  )
}

export default App