import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import socket from '../services/socket';
import MessageBubble from '../components/MessageBubble';

const OneToOneChat = () => {
    const [searchParams] = useSearchParams();
    const chatId = searchParams.get('id');
    const { user } = useAuth();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const loadMessages = async () => {
            try {
                const data = await api.fetchMessages(chatId);
                setMessages(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load messages', error);
                setLoading(false);
            }
        };

        loadMessages();

        // Socket listeners
        if (!socket.connected) socket.connect();

        socket.emit('joinRoom', chatId);

        const handleReceiveMessage = (message) => {
            if (message.chatId === chatId || !message.chatId) { // !message.chatId for demo simplicity
                setMessages((prev) => [...prev, message]);
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
            socket.emit('leaveRoom', chatId);
        };
    }, [chatId, user, navigate]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            id: Date.now(),
            text: newMessage,
            senderId: user.id,
            timestamp: Date.now(),
            chatId
        };

        // Optimistic update
        setMessages((prev) => [...prev, messageData]);
        socket.emit('sendMessage', messageData);
        setNewMessage('');

        // In a real app, you might wait for ack or send to API too
        // api.sendMessage(chatId, messageData);
    };

    if (loading) return <div className="flex h-full items-center justify-center text-gray-500">Loading chat...</div>;

    return (
        <div className="flex flex-col h-full bg-white">
            <header className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 sticky top-0">
                <div className="flex items-center">
                    <button onClick={() => navigate('/')} className="md:hidden mr-3 text-gray-500 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {chatId?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Chat {chatId}</h3>
                            <span className="text-xs text-green-500 flex items-center gap-1">● Online</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                        <p>No messages yet</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isOwn={msg.senderId === user.id}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="p-4 flex items-center border-t border-gray-100 bg-white" onSubmit={handleSend}>
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full pl-4 pr-10 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all border-transparent border focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="ml-3 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm hover:shadow-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                </button>
            </form>
        </div>
    );
};

export default OneToOneChat;
