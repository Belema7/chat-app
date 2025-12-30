import React, { useState } from 'react';

const CreatePost = ({ onPost }) => {
    const [content, setContent] = useState('');
    const [media, setMedia] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim() && !media) return;

        onPost({ content, media });
        setContent('');
        setMedia(null);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setMedia(e.target.files[0]);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-4 transition duration-200">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <textarea
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50 hover:bg-white transition"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    rows="3"
                />

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            id="post-media-input"
                            className="hidden"
                        />
                        <label
                            htmlFor="post-media-input"
                            className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${media ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {media ? (
                                <>
                                    <span>📸 Image Added</span>
                                </>
                            ) : (
                                <>
                                    <span>📷 Add Photo</span>
                                </>
                            )}
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!content.trim() && !media}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition duration-200"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
