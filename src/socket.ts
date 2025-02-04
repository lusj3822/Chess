import { io } from 'socket.io-client';

export const socket = io('http://localhost:4000', {
    autoConnect: false
});

socket.on('connect', () => {
    console.log(`Client connected with id: ${socket.id}`);
});