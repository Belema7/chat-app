import React, { useState, useEffect } from 'react';
import CreatePost from '../components/Posts/CreatePost';
import PostItem from '../components/Posts/PostItem';
import { useAuth } from '../context/AuthContext';
import socket from '../services/socket';

const Posts = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Mock fetching initial posts
        const mockPosts = [
            { id: 1, author: 'Admin', content: 'Welcome to the public feed!', timestamp: new Date(), media: null }
        ];
        setPosts(mockPosts);

        // Listen for new posts
        const handleNewPost = (post) => {
            setPosts((prev) => [post, ...prev]);
        };

        socket.on('receivePost', handleNewPost);

        return () => {
            socket.off('receivePost', handleNewPost);
        };
    }, []);

    const handleCreatePost = ({ content, media }) => {
        const newPost = {
            id: Date.now(),
            author: user.name,
            content,
            timestamp: new Date().toISOString(),
            media: media ? URL.createObjectURL(media) : null // Simple local preview for now
        };

        // Optimistic update
        setPosts((prev) => [newPost, ...prev]);

        // Emit to socket (simulating backend)
        socket.emit('createPost', newPost);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center">
            <div className="w-full max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Home Page</h2>
                <CreatePost onPost={handleCreatePost} />
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Posts;
