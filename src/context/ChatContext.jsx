import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import socket from '../services/socket';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

const makeMockUsers = () => ({
    u1: { id: 'u1', username: 'Demo User', avatar: 'https://i.pravatar.cc/150?u=1' },
    other: { id: 'other', username: 'Alice', avatar: 'https://i.pravatar.cc/150?u=2' },
    u2: { id: 'u2', username: 'Bob', avatar: 'https://i.pravatar.cc/150?u=3' },
});

const makeMockGroups = () => ({
    g1: { id: 'g1', name: 'Team Chat', members: ['u1', 'other'] },
});

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();

    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState({});
    const [loading, setLoading] = useState({});
    const [error, setError] = useState(null);

    const users = useMemo(() => makeMockUsers(), []);
    const groups = useMemo(() => makeMockGroups(), []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await api.fetchChats();
                if (mounted) setChats(data);
            } catch (err) {
                console.error('Failed to load chats', err);
            }
        })();

        const onReceive = (message) => {
            if (!message?.chatId) return;
            setMessages((prev) => {
                const list = prev[message.chatId] ? [...prev[message.chatId]] : [];
                if (!list.some((m) => m.id === message.id)) list.push(message);
                return { ...prev, [message.chatId]: list };
            });
        };

        socket.on('receiveMessage', onReceive);

        return () => {
            mounted = false;
            socket.off('receiveMessage', onReceive);
        };
    }, []);

    const loadMessages = async (chatId) => {
        if (!chatId) return;
        setLoading((s) => ({ ...s, [chatId]: true }));
        try {
            const data = await api.fetchMessages(chatId);
            const shaped = data.map((m, idx) => ({
                id: m.id ?? `${chatId}-${idx}-${Date.now()}`,
                senderId: m.senderId ?? 'other',
                text: m.text ?? m.message ?? m.content ?? '',
                timestamp: m.timestamp ?? Date.now() - 1000 * (data.length - idx),
                chatId,
            }));
            setMessages((prev) => ({ ...prev, [chatId]: shaped }));
        } catch (err) {
            console.error('loadMessages error', err);
            setError(err.message || 'Failed to load messages');
        } finally {
            setLoading((s) => ({ ...s, [chatId]: false }));
        }
    };

    const sendMessage = (chatId, text) => {
        if (!chatId || !text) return;
        if (!user) {
            setError('Not authenticated');
            return;
        }
        const message = {
            id: `${user.id}-${Date.now()}`,
            senderId: user.id,
            text: text.trim(),
            timestamp: Date.now(),
            chatId,
        };
        setMessages((prev) => {
            const list = prev[chatId] ? [...prev[chatId], message] : [message];
            return { ...prev, [chatId]: list };
        });
        if (!socket.connected) socket.connect();
        socket.emit('sendMessage', message);
        setTimeout(() => {
            const echo = { ...message };
            if (chatId.startsWith('g') || Math.random() > 0.5) {
                echo.id = `echo-${Date.now()}`;
                echo.senderId = echo.senderId === 'u1' ? 'other' : 'u1';
            }
            socket.receiveFakeMessage?.(echo);
        }, 400);
    };

    const createGroup = ({ name, description, avatar, members }) => {
        const id = `g${Date.now()}`;
        const group = { id, name, description: description || '', avatar: avatar || 'https://placehold.co/150x150/888/fff?text=GRP', type: 'group', members };
        // Add to chats list
        setChats((prev) => [group, ...prev]);
        // Add to groups map
        // groups is memoized; keep a simple approach by storing members in messages map for now
        setMessages((prev) => ({ ...prev, [id]: [] }));
        return group;
    };

    const addMemberToGroup = (groupId, userId) => {
        setChats((prev) => prev.map((c) => (c.id === groupId ? { ...c, members: Array.from(new Set([...(c.members || []), userId])) } : c)));
    };

    const removeMemberFromGroup = (groupId, userId) => {
        setChats((prev) => prev.map((c) => (c.id === groupId ? { ...c, members: (c.members || []).filter((m) => m !== userId) } : c)));
    };

    const value = {
        chats,
        messages,
        loadMessages,
        sendMessage,
        createGroup,
        addMemberToGroup,
        removeMemberFromGroup,
        users,
        groups,
        loading,
        error,
        setError,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
