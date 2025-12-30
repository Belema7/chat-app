const MessageBubble = ({ message, isOwn }) => {
    const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`flex w-full mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`
                max-w-[75%] px-4 py-2 rounded-2xl break-words relative shadow-sm
                ${isOwn
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                }
            `}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <span className={`text-[10px] block mt-1 text-right ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                    {time}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;
