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

    if (loading) return <div className="loading">Loading chat...</div>;

    return (
        <div className="chat-layout">
            <header className="chat-header">
                <button onClick={() => navigate('/')} className="back-btn">← Back</button>
                <h3>Chat {chatId}</h3>
            </header>

            <div className="message-list">
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        isOwn={msg.senderId === user.id}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form className="message-input" onSubmit={handleSend}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit" className="btn-send">Send</button>
            </form>
        </div>
    );
};

export default OneToOneChat;
