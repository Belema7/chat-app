import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import ChatList from '../components/ChatList';
import socket from '../services/socket';

const Home = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    // Protect Route
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    // Fetch Chats and Connect Socket
    useEffect(() => {
        if (!user) return;

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

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            // Optional: disconnect on unmount if we want strict cleanup
            // socket.disconnect();
        };
    }, [user]);

    if (authLoading || loading) return <div className="loading">Loading...</div>;

    return (
        <div className="home-container">
            <header className="app-header">
                <h1>Messages</h1>
                <div className="user-controls">
                    <span className="user-name">{user?.name}</span>
                    <button onClick={logout} className="btn-logout">Logout</button>
                </div>
            </header>
            <main className="chat-list-container">
                <ChatList chats={chats} />
            </main>
        </div>
    );
};

export default Home;
