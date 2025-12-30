import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatList from '../components/ChatList';
import OneToOneChat from './OneToOneChat';
import { api } from '../services/api';

const Chat = () => {
    const [searchParams] = useSearchParams();
    const activeChatId = searchParams.get('id');
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadChats = async () => {
            try {
                const data = await api.fetchChats();
                setChats(data);
            } catch (error) {
                console.error('Failed to fetch chats', error);
            } finally {
                setLoading(false);
            }
        };
        loadChats();
    }, []);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Panel: Chat List - Hidden on mobile if chat is active */}
            <div className={`
                w-full md:w-80 border-r border-gray-200 bg-white flex flex-col z-10
                ${activeChatId ? 'hidden md:flex' : 'flex'}
            `}>
                <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center sticky top-0">
                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                    <button className="p-2 hover:bg-gray-100 rounded-full text-blue-600 bg-blue-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Loading chats...</div>
                    ) : (
                        <ChatList chats={chats} />
                    )}
                </div>
            </div>

            {/* Right Panel: Active Chat Window - Hidden on mobile if no chat active */}
            <div className={`
                flex-1 flex flex-col bg-white
                ${!activeChatId ? 'hidden md:flex' : 'flex absolute md:static inset-0 z-20'}
            `}>
                {activeChatId ? (
                    <OneToOneChat />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-gray-200"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                        <p className="text-lg font-medium text-gray-400">Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
