import { Link } from 'react-router-dom';

const ChatList = ({ chats }) => {
    if (!chats || chats.length === 0) {
        return <div className="p-4 text-center text-gray-500">No chats available</div>;
    }

    return (
        <div className="flex flex-col">
            {chats.map((chat) => (
                <Link
                    key={chat.id}
                    to={chat.type === 'group' ? `/group-chat?id=${chat.id}` : `/chat?id=${chat.id}`}
                    className="block hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                    <div className="flex items-center p-3">
                        <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover mr-3 bg-gray-200" />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ChatList;
