// Mock Socket Service
// Simulating socket.io-client

// Simple EventEmitter replacement for browser
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return this;
    }

    off(event, listenerToRemove) {
        if (!this.events[event]) return this;
        this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
        return this;
    }

    emit(event, ...args) {
        if (!this.events[event]) return false;
        this.events[event].forEach(listener => {
            listener(...args);
        });
        return true;
    }
}

class MockSocket extends EventEmitter {
    constructor() {
        super();
        this.connected = false;
        console.log('Mock Socket initialized');
    }

    connect() {
        this.connected = true;
        this.emit('connect');
        console.log('Mock Socket connected');
    }

    disconnect() {
        this.connected = false;
        this.emit('disconnect');
        console.log('Mock Socket disconnected');
    }

    emit(event, ...args) {
        console.log(`[Socket Out] ${event}`, args);
        super.emit(event, ...args);
    }

    // Simulate server sending a message
    receiveFakeMessage(message) {
        console.log(`[Socket In] receiveMessage`, message);
        super.emit('receiveMessage', message);
    }

    // Simulate receiving a post (echo back to all clients)
    // In a real app, the server would broadcast this
    createPost(post) {
        // We can simulate an echo or broadcast here if we want to test multi-window
        // but the component typically does an optimistic update.
        // Let's just log it for now.
    }
}

const socket = new MockSocket();

export default socket;
