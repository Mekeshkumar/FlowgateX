import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:5000';

class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect(token) {
        if (this.socket?.connected) return;

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        this.socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
        });

        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    emit(event, data) {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
            this.listeners.set(event, callback);
        }
    }

    off(event) {
        if (this.socket && this.listeners.has(event)) {
            this.socket.off(event, this.listeners.get(event));
            this.listeners.delete(event);
        }
    }

    // Event-specific methods
    joinEventRoom(eventId) {
        this.emit('join:event', { eventId });
    }

    leaveEventRoom(eventId) {
        this.emit('leave:event', { eventId });
    }

    onEventUpdate(callback) {
        this.on('event:update', callback);
    }

    onCrowdUpdate(callback) {
        this.on('crowd:update', callback);
    }

    onIoTUpdate(callback) {
        this.on('iot:update', callback);
    }

    onNotification(callback) {
        this.on('notification', callback);
    }
}

export const socketService = new SocketService();
export default socketService;
