import { useRef, useState, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import Modal from 'pages/component/popup';

function PostTab({ user }) {
    console.log(user, "user");

    const posts = user?.blog || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postName, setPostName] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const quillRef = useRef(null);
    const quillInstance = useRef(null);

    const handleAddPostClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitPost = () => {
        // Post submission logic here
        console.log("Submitting post:", { postName, slug, content });
        setIsModalOpen(false); // Close modal after submission
    };

    // Initialize Quill editor when the modal is open
    useEffect(() => {
        if (isModalOpen && quillRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(quillRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ header: '1' }, { header: '2' }, { font: [] }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['bold', 'italic', 'underline'],
                        [{ align: [] }],
                        ['link'],
                    ],
                },
            });

            // Listen for content changes
            quillInstance.current.on('text-change', () => {
                setContent(quillInstance.current.root.innerHTML);
            });
        }

        // Destroy Quill editor when the modal is closed
        return () => {
            if (!isModalOpen && quillInstance.current) {
                quillInstance.current = null;
            }
        };
    }, [isModalOpen]); // Re-run this effect when modal opens or closes

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Posts</h1>
                <button
                    className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                    onClick={handleAddPostClick}
                >
                    Add Post
                </button>
            </div>

            <div className="space-y-6">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
                    >
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
                                <div className="flex space-x-2">
                                    <button
                                        className="text-sm text-blue-500 hover:text-blue-700 font-medium"
                                        onClick={() => alert(`Edit post: ${post.id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-sm text-red-500 hover:text-red-700 font-medium"
                                        onClick={() => alert(`Delete post: ${post.id}`)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{post.content}</p>
                            <p className="text-xs text-gray-400 mt-1">Published on: {post.date}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for adding a post */}
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add Post">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <input
                                type="text"
                                placeholder="Post Name"
                                className="border border-gray-200 rounded-md p-2"
                                value={postName}
                                onChange={(e) => setPostName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Slug"
                                className="border border-gray-200 rounded-md p-2"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                            />
                            <div className="col-span-2">
                                {/* short description */}
                                <textarea
                                    placeholder="Post Intro"
                                    className="w-full border border-gray-200 rounded-md p-2"
                                    rows={4}
                                />
                            </div>
                            <div className="col-span-2">
                                <div ref={quillRef} style={{ height: "400px" }} />
                            </div>
                            <div className="col-span-2">
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                    onClick={handleSubmitPost}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

export default PostTab;
