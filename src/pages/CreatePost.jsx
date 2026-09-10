import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
// import './index.css';

function CreatePost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const { token } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://localhost:3000/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content, imageUrl }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.message || data);
                return;
            }
            navigate(`/posts/${data._id}`);
        } catch (err) {
            setError("Failed to create post. Please try again.");
        }
    }
    return (
        <div className="container">
            <h1 className="page-title">Create Post</h1>
            <form onSubmit={handleSubmit} className="form-card">
                <input type="text" placeholder="Title" value={title}
                    onChange={(e) => setTitle(e.target.value)} required className="form-input" />
                <textarea placeholder="Content" value={content}
                    onChange={(e) => setContent(e.target.value)} required className="form-textarea" />
                <input type="text" placeholder="Image URL" value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)} className="form-input" />
                <button type="submit" className="btn-primary">Create</button>
            </form>
            {error && <p className="error-text">{error}</p>}
        </div>

    );
}

export default CreatePost;