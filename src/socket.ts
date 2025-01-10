import React from 'react';
import { io } from 'socket.io-client';

export const socket = io("http://localhost:3000/");
export const SocketContext = React.createContext(socket);

socket.on('connect', () => {
  console.log(`Client connected with ID: ${socket.id}`);
});