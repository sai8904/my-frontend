import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';   // import the CSS file
import { motion } from "framer-motion";
function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("https://my-backend-pkcm.onrender.com/api/posts");
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }}  animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="home-container">
      <h1 className="home-title">All Posts</h1>
      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      <div className="posts-list">
        {posts.map((post) => (
          <Link to={`/posts/${post._id}`} className="post-link">
          <div key={post._id} className="post-card">
            <h2 className="post-title">
                {post.title}
            </h2>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="post-image"
              />
            )}
            <p className="post-author">by {post.author?.email}</p>
          </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default Home;
