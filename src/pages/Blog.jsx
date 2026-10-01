import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { portfolioApi } from "../api";
import "./blog.css";

const DEFAULT_POSTS = [
  {
    id: 1,
    title: "1️⃣ Why Computer Science Became My Career Path",
    text: "I chose Computer Science Engineering because it allows me to turn ideas into real, impactful solutions. From writing my first program to building full-scale applications and AI-based systems, CSE gives me the freedom to create, innovate, and continuously learn.",
  },
  {
    id: 2,
    title: "2️⃣ Learning Through Projects, Not Just Theory",
    text: "I believe design should be a balance between functionality and emotion. Dark themes with minimalist layouts always inspire me to create something that feels personal and futuristic.",
  },
  {
    id: 3,
    title: "3️⃣ Balancing Tech and Creativity",
    text: "For me, creativity doesn’t stop at design—it extends into problem-solving and system architecture. Whether it’s structuring clean code or designing intuitive user interactions, I enjoy blending technical precision with creative thinking in every project I build.",
  },
  {
    id: 4,
    title: "4️⃣The Beauty of Simple Code",
    text: "Clean code isn’t just about fewer lines — it’s about clarity. Elegance in code feels like poetry to me — each function should have rhythm and purpose.",
  },
];

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadBlogs() {
      const savedVotes = JSON.parse(localStorage.getItem("kd_blog_votes") || "{}");
      const votedByUser = JSON.parse(localStorage.getItem("kd_blog_voted") || "{}");

      try {
        const liveBlogs = await portfolioApi.getBlogs(DEFAULT_POSTS);
        const sourceData = (liveBlogs && liveBlogs.length > 0)
          ? liveBlogs.map((b, i) => ({
              id: b.id || i + 1,
              title: b.title,
              text: b.content || b.excerpt || b.text
            }))
          : DEFAULT_POSTS;

        const withVotes = sourceData.map((p) => ({
          ...p,
          agree: savedVotes[p.id]?.agree || 0,
          disagree: savedVotes[p.id]?.disagree || 0,
          userVote: votedByUser[p.id] || null,
        }));
        setPosts(withVotes);
      } catch (e) {
        const withVotes = DEFAULT_POSTS.map((p) => ({
          ...p,
          agree: savedVotes[p.id]?.agree || 0,
          disagree: savedVotes[p.id]?.disagree || 0,
          userVote: votedByUser[p.id] || null,
        }));
        setPosts(withVotes);
      }
    }
    loadBlogs();
  }, []);

  function vote(id, type) {
    const votedByUser = JSON.parse(localStorage.getItem("kd_blog_voted") || "{}");
    if (votedByUser[id]) return;

    const next = posts.map((p) =>
      p.id === id ? { ...p, [type]: p[type] + 1, userVote: type } : p
    );
    setPosts(next);

    const votes = Object.fromEntries(
      next.map((p) => [p.id, { agree: p.agree, disagree: p.disagree }])
    );
    localStorage.setItem("kd_blog_votes", JSON.stringify(votes));
    localStorage.setItem(
      "kd_blog_voted",
      JSON.stringify({ ...votedByUser, [id]: type })
    );
  }

  return (
    <motion.section
      className="blog-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="blog-title"
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        📝 My Blog
      </motion.h2>
      <p className="blog-sub">
        Personal thoughts, experiences, and reflections — feel free to react!
      </p>

      <div className="blog-grid">
        {posts.map((p, idx) => (
          <motion.div
            key={p.id}
            className="blog-post"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 20px rgba(255,255,255,0.1)",
            }}
          >
            <h3 className="post-title">{p.title}</h3>
            <p className="post-text">{p.text}</p>

            <div className="vote-container">
              <motion.button
                onClick={() => vote(p.id, "agree")}
                disabled={!!p.userVote}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.15 }}
                className={`vote-btn-circle agree ${
                  p.userVote === "agree" ? "active" : ""
                }`}
              >
                <ThumbsUp size={20} />
                <motion.span
                  key={p.agree}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="vote-count"
                >
                  {p.agree}
                </motion.span>
              </motion.button>

              <motion.button
                onClick={() => vote(p.id, "disagree")}
                disabled={!!p.userVote}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.15 }}
                className={`vote-btn-circle disagree ${
                  p.userVote === "disagree" ? "active" : ""
                }`}
              >
                <ThumbsDown size={20} />
                <motion.span
                  key={p.disagree}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="vote-count"
                >
                  {p.disagree}
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
