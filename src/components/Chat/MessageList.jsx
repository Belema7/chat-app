import React, { useEffect, useRef } from 'react';
import MessageBubble from '../../components/MessageBubble';

const MessageList = ({ messages = [], currentUserId }) => {
    const containerRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    return (
        <div
            className="message-list"
            ref={containerRef}
            style={{
                overflowY: 'auto',
                flex: 1,
                padding: '12px',
                height: '100%' // Ensure it takes full height
            }}
        >
            {messages.map((msg) => (
                <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.senderId === currentUserId}
                />
            ))}
        </div>
    );
};

export default MessageList;