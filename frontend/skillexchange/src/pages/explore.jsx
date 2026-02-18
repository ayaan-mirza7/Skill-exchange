import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import "./explore.css";

export default function Explore() {
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all"); // all | videos | notes | skills

  const navigate = useNavigate();

  const load = async () => {
    try {
      const v = await api.get("/videos");
      const n = await api.get("/notes");

      setVideos(v.data || []);
      setNotes(n.data || []);
    } catch (err) {
      console.error("Explore load error", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const downloadNote = async (id) => {
    try {
      const res = await api.post(
        `/notes/download/${id}`,
        {},
        { responseType: "blob" },
      );
      const disposition = res.headers["content-disposition"] || "";
      let filename = "downloaded-file";
      const match = disposition.match(/filename="(.+)"/);
      if (match?.[1]) filename = match[1];

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Not enough credits or download error");
    }
  };

  // derive a faux "skills" list by extracting frequent words from titles
  const skills = useMemo(() => {
    const pool = [
      ...videos.map((v) => v.title || ""),
      ...notes.map((n) => n.title || ""),
    ];
    const freq = {};
    pool.forEach((txt) => {
      txt
        .replace(/[^a-zA-Z0-9 ]/g, " ")
        .split(" ")
        .map((w) => w.trim().toLowerCase())
        .filter((w) => w.length > 3)
        .forEach((w) => (freq[w] = (freq[w] || 0) + 1));
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 24)
      .map((x) => x[0]);
  }, [videos, notes]);

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(query.toLowerCase()),
  );
  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="explore-page page-container">
      <Navbar />

      <header className="explore-hero">
        <div className="hero-inner">
          <h1>Explore Skills & Resources</h1>
          <p>
            Discover community skills, notes and videos — find what you need
            fast.
          </p>

          <div className="explore-actions">
            <input
              className="explore-search"
              placeholder="Search videos, notes or skills..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="explore-tabs">
              <button
                className={tab === "all" ? "active" : ""}
                onClick={() => setTab("all")}
              >
                All
              </button>
              <button
                className={tab === "videos" ? "active" : ""}
                onClick={() => setTab("videos")}
              >
                Videos
              </button>
              <button
                className={tab === "notes" ? "active" : ""}
                onClick={() => setTab("notes")}
              >
                Notes
              </button>
              <button
                className={tab === "skills" ? "active" : ""}
                onClick={() => setTab("skills")}
              >
                Skills
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="explore-content">
        {tab === "all" || tab === "skills" ? (
          <section className="skills-section">
            <h2 className="section-title">🧭 Skills</h2>
            {skills.length === 0 && <p>No skills detected yet.</p>}

            <div className="skills-grid">
              {skills
                .filter((s) => s.includes(query.toLowerCase()))
                .map((s) => (
                  <button
                    key={s}
                    className="skill-chip"
                    onClick={() => setQuery(s)}
                  >
                    {s}
                  </button>
                ))}
            </div>
          </section>
        ) : null}

        {(tab === "all" || tab === "videos") && (
          <section className="videos-section">
            <h2 className="section-title">📺 Videos</h2>
            <div className="cards-grid">
              {filteredVideos.map((v) => (
                <article key={v._id} className="resource-card">
                  <div className="card-thumb" />
                  <div className="card-body">
                    <h3>{v.title}</h3>
                    <p className="muted">{v.description}</p>
                    <div className="card-row">
                      <span className="cost">{v.cost} credits</span>
                      <button onClick={() => navigate(`/video/${v._id}`)}>
                        Watch
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {(tab === "all" || tab === "notes") && (
          <section className="notes-section">
            <h2 className="section-title">📁 Notes</h2>
            <div className="cards-grid">
              {filteredNotes.map((n) => (
                <article key={n._id} className="resource-card note">
                  <div className="card-thumb note-thumb">📄</div>
                  <div className="card-body">
                    <h3>{n.title}</h3>
                    <div className="card-row">
                      <span className="cost">{n.cost} credits</span>
                      <button onClick={() => downloadNote(n._id || n.id)}>
                        Download
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
