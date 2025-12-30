const MessageBubble = ({ message, isOwn }) => {
    const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
            <div className="message-content">
                <p>{message.text}</p>
                <span className="timestamp">{time}</span>
            </div>
        </div>
    );
};

export default MessageBubble;
