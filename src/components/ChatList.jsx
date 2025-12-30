import { Link } from 'react-router-dom';

const ChatList = ({ chats }) => {
    if (!chats || chats.length === 0) {
        return <div className="no-chats">No chats available</div>;
    }

    return (
        <div className="chat-list">
            {chats.map((chat) => (
                <Link
                    key={chat.id}
                    to={chat.type === 'group' ? `/group-chat?id=${chat.id}` : `/chat?id=${chat.id}`}
                    className="chat-item-link"
                >
                    <div className="chat-item">
                        <img src={chat.avatar} alt={chat.name} className="avatar" />
                        <div className="chat-info">
                            <h3 className="chat-name">{chat.name}</h3>
                            <p className="last-message">{chat.lastMessage}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ChatList;
