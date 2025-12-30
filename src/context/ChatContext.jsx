import { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);

    return (
        <ChatContext.Provider value={{ chats, setChats }}>
            {children}
        </ChatContext.Provider>
    );
};
