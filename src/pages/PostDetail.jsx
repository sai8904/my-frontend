import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PostDetail.css';   // add a CSS file for styling
import { motion } from "framer-motion";
function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [answer, setAnswer] = useState(null);
  const [asking, setAsking] = useState(false);

  const [summary, setSummary] = useState(null);
  const [summarizing, setSummarizing] = useState(false);
  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`https://my-backend-pkcm.onrender.com/api/posts/${id}`);
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError("Failed to fetch post");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);


  async function handleSummarize() {
    setSummarizing(true);
    try {
      const response = await fetch(`https://my-backend-pkcm.onrender.com/api/posts/${id}/summarize`, { method: "POST" });
      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setSummary("Failed to generate summary");
    } finally {
      setSummarizing(false);
    }
  }
  async function handleAsk() {
    setAsking(true);
    try {
      const response = await fetch(`https://my-backend-pkcm.onrender.com/api/posts/${id}/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (err) {
      setAnswer("Failed to generate response");
    } finally {
      setAsking(false);
    }
  }


  const [explanation, setExplanation] = useState(null);
  const [explaining, setExplaining] = useState(false);

  async function handleExplain() {
    setExplaining(true);
    try {
      const response = await fetch(`https://my-backend-pkcm.onrender.com/api/posts/${id}/explain`, { method: "POST" });
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (err) {
      setExplanation("Failed to generate explanation");
    } finally {
      setExplaining(false);
    }
  }


  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!post) return <p className="loading-text">Post not found</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="post-container">
      <div className="post-card">
        <h1 className="post-title">{post.title}</h1>
        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className="post-image" />
        )}
        <p className="post-author">by {post.author?.email}</p>
        <p className="post-content">{post.content}</p>

        {/* Summarize */}
        <button onClick={handleSummarize} disabled={summarizing} className="summary-button">
          {summarizing ? "Summarizing..." : "Get AI Summary"}
        </button>
        {summary && (
          <div className="result-box">
            <h2 className="result-title">AI Summary</h2>
            <p className="result-text">{summary}</p>
          </div>
        )}

        {/* Ask AI */}
        <div className="prompt-box">
          <input
            type="text"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Ask AI about this post..."
            className="prompt-input"
          />
          <button onClick={handleAsk} disabled={asking} className="summary-button">
            {asking ? "Thinking..." : "Ask AI"}
          </button>
        </div>
        {answer && (
          <div className="result-box">
            <h2 className="result-title">AI Response</h2>
            <p className="result-text">{answer}</p>
          </div>
        )}

        {/* Explain */}
        <button onClick={handleExplain} disabled={explaining} className="summary-button">
          {explaining ? "Explaining..." : "Explain in Detail"}
        </button>
        {explanation && (
          <div className="result-box">
            <h2 className="result-title">AI Explanation</h2>
            <p className="result-text">{explanation}</p>
          </div>
        )}

        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </motion.div>

  );
}

export default PostDetail;