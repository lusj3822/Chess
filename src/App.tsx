import './App.css';

import Chessboard from './components/Chessboard/Chessboard';
import Playerbar from './components/Playerbar/Playerbar';
import { useEffect, useState } from 'react';
import { GameContext, GameState, PlayerData, Time } from './interfaces';

import { socket } from './socket';
import Navbar from './components/Navbar/Navbar';
import LoginForm from './components/LoginForm/LoginForm';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("Guest");

  const [gameState, setGameState] = useState<GameState>({
      checkmate: false,
      stalemate: false,
      draw: false,
      noTime: false,
      ongoingGame: false,
      currentTurn: 'w',
    });
  const [resetTime, setResetTime] = useState<boolean>(false);

  const [startGame, setStartGame] = useState<boolean>(false);

  useEffect(() => {
    socket.on('game-state', (data) => {
      setGameState((prevState) => ({
        ...prevState,
        ...data.gameState,
      }));
      gameContext.resetTime = data.resetTime;
    });

    socket.on('start-game', () => {
      setStartGame(true);
    })
  
    return () => {
      socket.off('game-state');
      socket.off('start-game');
    };
  }, []);  

  const [playComputerFlag, setPlayComputerFlag] = useState<boolean>(true);

  const gameContext: GameContext = {
    gameState,
    setGameState,
    resetTime,
    setResetTime,
    playComputer: playComputerFlag,
  };

  const [playerTime, setPlayerTime] = useState<Time>({ minutes: 5, seconds: 0 });
  const [opponentPlayerTime, setOpponentPlayerTime] = useState<Time>({ minutes: 5, seconds: 0 });

  const [playerColor, setPlayerColor] = useState<'black' | 'white'>('white');
  
  useEffect(() => {
    socket.on('color-assignment', (data: { color: 'black' | 'white' }) => {
      setPlayerColor(data.color);
    });

    return () => {
      socket.off('color-assignment');
    };
  }, []);

  const opponentPlayerData: PlayerData = {
    image: "player-icons/opponent.png",
    userName: playComputerFlag ? 'Computer' : playerColor == 'black' ? 'You are playing as black' : '',
    color: 'black',
    turnStatus: gameContext.gameState.currentTurn === 'b' ? "Your turn" : "",
    time: opponentPlayerTime,
    setTime: setOpponentPlayerTime,
  };
  
  const playerData: PlayerData = {
    image: "player-icons/player.jpg",
    userName: gameContext.playComputer ? username : playerColor == 'white' ? 'You are playing as white' : '',
    color: playerColor,
    turnStatus: gameContext.gameState.currentTurn === 'w' ? "Your turn" : "",
    time: playerTime,
    setTime: setPlayerTime,
  };

  function playComputer(): void {
    socket.emit('reset-game');
    socket.disconnect();
    setPlayComputerFlag(true);
    setPlayerColor('white');
  }

  function playMultiplayer(): void {
    socket.connect();
    setPlayComputerFlag(false);
  }

  function login(): void {
    setIsLoggedIn(true);
    setUsername("Jens");
  }

  return (
    <div>
      {!isLoggedIn && <LoginForm login={login}/>}
      <Navbar playComputer={playComputer} playMultiplayer={playMultiplayer}/>
      {playComputerFlag || startGame ? (
        <>
          <Playerbar className="opponent-player-bar" playerData={opponentPlayerData} gameContext={gameContext} />
          <Chessboard gameContext={gameContext} opponentPlayerData={opponentPlayerData} playerData={playerData}/>
          <Playerbar className="player-bar" playerData={playerData} gameContext={gameContext} />
        </>
      ) : (
        <h1>Waiting for opponent...</h1>
      )}
    </div>
  );
}

export default App