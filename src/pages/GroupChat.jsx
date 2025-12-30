import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import socket from '../services/socket';
import MessageBubble from '../components/MessageBubble';

const GroupChat = () => {
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

        if (!socket.connected) socket.connect();

        socket.emit('joinRoom', chatId);

        const handleReceiveMessage = (message) => {
            // In a real group chat, ensuring we only accept messages for this room
            if (message.chatId === chatId) {
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
            senderId: user.id, // In group, sender is the user
            timestamp: Date.now(),
            chatId // Important for group
        };

        setMessages((prev) => [...prev, messageData]);
        socket.emit('sendMessage', messageData);
        setNewMessage('');
    };

    if (loading) return <div className="loading">Loading group chat...</div>;

    return (
        <div className="chat-layout">
            <header className="chat-header">
                <button onClick={() => navigate('/')} className="back-btn">← Back</button>
                <h3>Group {chatId}</h3>
                {/* Could add member count or list toggle here */}
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
                    placeholder="Message the group..."
                />
                <button type="submit" className="btn-send">Send</button>
            </form>
        </div>
    );
};

export default GroupChat;
