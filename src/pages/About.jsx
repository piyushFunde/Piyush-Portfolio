import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUniversity, FaSchool, FaGraduationCap } from "react-icons/fa";
import { portfolioApi } from "../api";

const defaultBio = {
  fullName: "Piyush Funde",
  title: "Java Developer and Backend Developer",
  bioParagraph1: "Hi, I’m Piyush Funde — an aspiring Java Developer and Backend Developer. I build intelligent, user-centric applications using Python, Java, and modern web technologies. Experienced in AI-powered healthcare assistants, REST APIs, and scalable backend systems.",
  bioParagraph2: "Beyond code, I enjoy understanding system design, improving application performance, and exploring how intelligent systems can solve real-world problems. I combine practical problem-solving with technical precision to build solutions that not only work efficiently — but also create real value for users.",
  bioParagraph3: "4th-year B.Tech Computer Science student at MIT ADT University, Pune, with a strong foundation in Data Structures, Algorithms, and Object-Oriented Programming."
};

const AboutMe = () => {
  const [about, setAbout] = useState(defaultBio);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await portfolioApi.getAbout();
        if (data && (data.bioParagraph1 || data.bio)) {
          setAbout({
            fullName: data.fullName || defaultBio.fullName,
            title: data.title || defaultBio.title,
            bioParagraph1: data.bioParagraph1 || data.bio || defaultBio.bioParagraph1,
            bioParagraph2: data.bioParagraph2 || defaultBio.bioParagraph2,
            bioParagraph3: data.bioParagraph3 || defaultBio.bioParagraph3
          });
        }
      } catch {}
    }
    loadData();
  }, []);
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top, #0d0d0d, #000)",
        color: "white",
        padding: "3rem 1rem",
      }}
    >
      {/* --- About Me + Education Section --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        style={{
          width: "100%",
          maxWidth: "1100px",
          textAlign: "left",
          marginTop: "1rem",
          lineHeight: 1.8,
          background: "rgba(255,255,255,0.04)",
          padding: "3rem 3.5rem",
          borderRadius: "18px",
          boxShadow: "0 0 25px rgba(0,255,200,0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* --- Header --- */}
        <h2
          style={{
            fontSize: "1.9rem",
            marginBottom: "1.2rem",
            background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          About Me
        </h2>

        {/* --- Description --- */}
        <p
          style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.85)",
            marginBottom: "1rem",
            lineHeight: 1.8,
            whiteSpace: "pre-line"
          }}
        >
          {about.bioParagraph1}
        </p>

        {about.bioParagraph2 && (
          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.8)",
              marginBottom: "1rem",
              lineHeight: 1.8,
              whiteSpace: "pre-line"
            }}
          >
            {about.bioParagraph2}
          </p>
        )}

        {about.bioParagraph3 && (
          <p
            style={{
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.75)",
              marginTop: "0.8rem",
              lineHeight: 1.8,
              whiteSpace: "pre-line"
            }}
          >
            {about.bioParagraph3}
          </p>
        )}

        {/* --- Education Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{ marginTop: "3rem" }}
        >
          <h3
            style={{
              fontSize: "1.6rem",
              marginBottom: "1.5rem",
              background:
                "linear-gradient(90deg, var(--accent), var(--accent-2))",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Education
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
            }}
          >
            {/* --- Education Card 1 --- */}
            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 25px rgba(0,255,200,0.15)",
              }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: "14px",
                padding: "1.5rem 2rem",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 0 15px rgba(0,255,200,0.05)",
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
              }}
            >
              <FaUniversity size={40} color="var(--accent)" />
              <div>
                <h4
                  style={{
                    color: "var(--accent)",
                    marginBottom: "0.4rem",
                    fontSize: "1.25rem",
                  }}
                >
                  B.Tech in Computer Science
                </h4>
                <p
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    marginBottom: "0.2rem",
                  }}
                >
                  <strong>MIT Art, Design and Technology University</strong> — Pune,
                  Maharashtra
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>
                  4th Year (Pursuing) | GPA: 7.37
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>2022 – 2026</p>
              </div>
            </motion.div>

            {/* --- Education Card 2 --- */}
            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 25px rgba(0,255,200,0.15)",
              }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: "14px",
                padding: "1.5rem 2rem",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 0 15px rgba(0,255,200,0.05)",
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
              }}
            >
              <FaGraduationCap size={38} color="var(--accent)" />
              <div>
                <h4
                  style={{
                    color: "var(--accent)",
                    marginBottom: "0.4rem",
                    fontSize: "1.25rem",
                  }}
                >
                  Higher Secondary Education (12th Grade)
                </h4>
                <p
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    marginBottom: "0.2rem",
                  }}
                >
                  <strong>S.H. Junior College</strong> — Khamla, Nagpur, Maharashtra
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>
                  Maharashtra Board | Percentage: 75%
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>Completed in 2021</p>
              </div>
            </motion.div>

            {/* --- Education Card 3 --- */}
            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 25px rgba(0,255,200,0.15)",
              }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: "14px",
                padding: "1.5rem 2rem",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 0 15px rgba(0,255,200,0.05)",
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
              }}
            >
              <FaSchool size={36} color="var(--accent)" />
              <div>
                <h4
                  style={{
                    color: "var(--accent)",
                    marginBottom: "0.4rem",
                    fontSize: "1.25rem",
                  }}
                >
                  Secondary Education (10th Grade)
                </h4>
                <p
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    marginBottom: "0.2rem",
                  }}
                >
                  <strong>P.P.S Purti Public School</strong> — Salekasa,
                  Gondia , Maharashtra
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>
                  CBSE Board
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>Completed in 2019</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutMe;
