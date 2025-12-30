import React, { useState } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';

const PostItem = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(post.comments || []);
    const [newComment, setNewComment] = useState('');

    const handleLike = () => {
        if (liked) {
            setLikeCount(prev => prev - 1);
        } else {
            setLikeCount(prev => prev + 1);
        }
        setLiked(!liked);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(),
            user: 'You', // Hardcoded for no-auth demo
            text: newComment,
            timestamp: new Date().toISOString()
        };

        setComments([comment, ...comments]);
        setNewComment('');
    };

    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 transition-all hover:shadow-md">
            {/* Header */}
            <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                    {post.author[0]}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{post.author}</h3>
                    <p className="text-xs text-gray-500">{timeAgo(post.timestamp)}</p>
                </div>
            </div>

            {/* Content */}
            <p className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed">{post.content}</p>

            {/* Media */}
            {post.media && (
                <div className="mb-4 rounded-lg overflow-hidden border border-gray-100">
                    <img src={post.media} alt="Post content" className="w-full h-auto object-cover max-h-96" />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${liked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{likeCount}</span>
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">{comments.length}</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                    <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="space-y-3">
                        {comments.map(comment => (
                            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-semibold text-sm text-gray-900">{comment.user}</span>
                                    <span className="text-xs text-gray-400">{timeAgo(comment.timestamp)}</span>
                                </div>
                                <p className="text-sm text-gray-700">{comment.text}</p>
                            </div>
                        ))}
                        {comments.length === 0 && (
                            <p className="text-center text-gray-400 text-sm py-2">No comments yet. Be the first!</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostItem;
