import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import MessageList from '../components/Chat/MessageList';
import MessageInput from '../components/Chat/MessageInput';

const OneToOneChat = () => {
    const [searchParams] = useSearchParams();
    const chatId = searchParams.get('id');
    const { user } = useAuth();
    const navigate = useNavigate();
    const { messages, loadMessages, sendMessage, loading } = useChat();
    const [newMessage, setNewMessage] = useState('');
    const currentMessages = messages[chatId] || [];

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        loadMessages(chatId);
        return () => { };
    }, [chatId, user, navigate]);
    const handleSend = (text) => sendMessage(chatId, text);

    if (loading && loading[chatId]) return <div className="loading">Loading chat...</div>;

    return (
        <div className="chat-layout">
            <header className="chat-header">
                <button onClick={() => navigate('/')} className="back-btn">← Back</button>
                <h3>Chat {chatId}</h3>
            </header>

            <MessageList messages={currentMessages} currentUserId={user.id} />
            <MessageInput onSend={handleSend} placeholder="Type a message..." />
        </div>
    );
};

export default OneToOneChat;
