import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import MessageList from '../components/Chat/MessageList';
import MessageInput from '../components/Chat/MessageInput';

const GroupChat = () => {
    const [searchParams] = useSearchParams();
    const chatId = searchParams.get('id');
    const { user } = useAuth();
    const navigate = useNavigate();
    const { messages, loadMessages, sendMessage, loading, groups } = useChat();
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

    if (loading && loading[chatId]) return <div className="loading">Loading group chat...</div>;

    return (
        <div className="chat-layout">
            <header className="chat-header">
                <button onClick={() => navigate('/')} className="back-btn">← Back</button>
                <h3>Group {chatId}</h3>
                {/* Could add member count or list toggle here */}
            </header>

            <MessageList messages={currentMessages} currentUserId={user.id} />
            <MessageInput onSend={handleSend} placeholder="Message the group..." />
        </div>
    );
};

export default GroupChat;
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
