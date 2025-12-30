import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import OneToOneChat from '../pages/OneToOneChat';
import GroupChat from '../pages/GroupChat';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<OneToOneChat />} />
            <Route path="/group-chat" element={<GroupChat />} />
        </Routes>
    );
};

export default AppRoutes;
