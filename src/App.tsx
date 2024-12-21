import './App.css';

import Chessboard from './components/Chessboard/Chessboard';
import Playerbar from './components/Playerbar/Playerbar';

function App() {

  return (
    <div>
      <Playerbar className='opponent-player-bar' image='dog.png' userName='Opponent'/>
      <Chessboard/>
      <Playerbar className='player-bar' image='cat.jpg' userName='Player'/>
    </div>
  )
}

export default App