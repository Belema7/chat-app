import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import OneToOneChat from '../pages/OneToOneChat';
import GroupChat from '../pages/GroupChat';
import Chat from '../pages/Chat';
import Posts from '../pages/Posts';
import Layout from '../components/Common/Layout';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/posts" element={<Posts />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
