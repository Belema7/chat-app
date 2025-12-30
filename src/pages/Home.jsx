import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PostItem from '../components/Posts/PostItem';
import CreatePost from '../components/Posts/CreatePost'; // Reusing for "New Post" or we can just list?
import socket from '../services/socket';

const Home = () => {
    const { user } = useAuth();
    const [myPosts, setMyPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        // Mock fetching *my* posts
        // In a real app, this would be an API call like /posts?userId=...
        const initialPosts = [
            {
                id: 101,
                author: user?.name || 'Me',
                authorId: user?.id,
                content: 'This is my first post! I can edit this.',
                timestamp: new Date().toISOString(),
                media: null
            },
            {
                id: 102,
                author: user?.name || 'Me',
                authorId: user?.id,
                content: 'Reflecting on the day...',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                media: null
            }
        ];
        setMyPosts(initialPosts);

        // Listen for updates (if we want real-time even for own posts)
        // socket.on('postUpdated', updateLocalPost);
    }, [user]);

    const handleUpdatePost = (updatedContent) => {
        if (!editingPost) return;

        const updated = { ...editingPost, content: updatedContent, timestamp: new Date().toISOString() };

        setMyPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
        setEditingPost(null);

        // socket.emit('updatePost', updated);
    };

    const handleDeletePost = (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            setMyPosts(prev => prev.filter(p => p.id !== postId));
            // socket.emit('deletePost', postId);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-3xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Posts</h1>
                    <p className="text-gray-500">Manage and update your personal content.</p>
                </header>

                <div className="space-y-6">
                    {myPosts.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-400">
                            You haven't posted anything yet.
                        </div>
                    ) : (
                        myPosts.map(post => (
                            <div key={post.id} className="relative group">
                                <PostItem post={post} />
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button
                                        onClick={() => setEditingPost(post)}
                                        className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium shadow-sm hover:bg-blue-50 border border-blue-100"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-medium shadow-sm hover:bg-red-50 border border-red-100"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit Modal Overlay */}
            {editingPost && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Post</h3>
                        <textarea
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4"
                            rows="5"
                            value={editingPost.content}
                            onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                        ></textarea>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setEditingPost(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleUpdatePost(editingPost.content)}
                                className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
