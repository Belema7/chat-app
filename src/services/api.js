// Mock API Service
// Simulating async REST API calls

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    login: async (email, password) => {
        await delay(800);
        if (email === 'demo@example.com' && password === 'password') {
            return {
                user: { id: 'u1', name: 'Demo User', email: 'demo@example.com', avatar: 'https://i.pravatar.cc/150?u=1' },
                token: 'mock-jwt-token',
            };
        }
        throw new Error('Invalid credentials');
    },

    register: async (name, email, password) => {
        await delay(800);
        return {
            user: { id: 'u' + Date.now(), name, email, avatar: `https://i.pravatar.cc/150?u=${Date.now()}` },
            token: 'mock-jwt-token-new',
        };
    },

    fetchChats: async () => {
        await delay(500);
        return [
            { id: 'c1', name: 'Alice', type: 'individual', lastMessage: 'Hey there!', avatar: 'https://i.pravatar.cc/150?u=2' },
            { id: 'c2', name: 'Bob', type: 'individual', lastMessage: 'Can we meet?', avatar: 'https://i.pravatar.cc/150?u=3' },
            { id: 'c3', name: 'tom', type: 'individual', lastMessage: 'Project deadline is tomorrow.', avatar: 'https://i.pravatar.cc/150?u=4' },
        
        ];
    },

    fetchMessages: async (chatId) => {
        await delay(300);
        return [
            { id: 'm1', senderId: 'u1', text: 'Hello!', timestamp: Date.now() - 10000 },
            { id: 'm2', senderId: 'other', text: 'Hi! How are you?', timestamp: Date.now() - 5000 },
        ];
    }
};
