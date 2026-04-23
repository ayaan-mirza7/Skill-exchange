import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import "./explore.css";
import "./AppPages.css";

export default function Explore() {
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [v, n] = await Promise.all([api.get("/videos"), api.get("/notes")]);
        setVideos(v.data || []);
        setNotes(n.data || []);
      } catch (err) {
        console.error("Explore load error", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const downloadNote = async (id) => {
    try {
      const res = await api.post(`/notes/download/${id}`, {}, { responseType: "blob" });
      const disposition = res.headers["content-disposition"] || "";
      const filename = disposition.match(/filename="(.+)"/)?.[1] || "downloaded-file";
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

  const skills = useMemo(() => {
    const freq = {};
    [...videos, ...notes].forEach((item) => {
      (item.title || "")
        .replace(/[^a-zA-Z0-9 ]/g, " ")
        .split(" ")
        .map((w) => w.trim().toLowerCase())
        .filter((w) => w.length > 3)
        .forEach((w) => {
          freq[w] = (freq[w] || 0) + 1;
        });
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 16)
      .map(([word]) => word);
  }, [videos, notes]);

  const filteredVideos = videos.filter((v) => v.title.toLowerCase().includes(query.toLowerCase()));
  const filteredNotes = notes.filter((n) => n.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main explore-main">
        <section className="explore-hero">
          <h1 className="page-title">Explore</h1>
          <p className="muted-text">Discover high-value videos and notes from the community.</p>
          <div className="explore-controls">
            <Input
              placeholder="Search videos, notes or skills"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="explore-tabs">
              {["all", "videos", "notes", "skills"].map((item) => (
                <Button
                  key={item}
                  variant={tab === item ? "primary" : "ghost"}
                  onClick={() => setTab(item)}
                >
                  {item[0].toUpperCase() + item.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {loading && <p className="muted-text">Loading resources...</p>}

        {(tab === "all" || tab === "skills") && (
          <section>
            <h2 className="section-heading">Skills</h2>
            <div className="skills-grid">
              {skills
                .filter((s) => s.includes(query.toLowerCase()))
                .map((s) => (
                  <button key={s} className="skill-chip" onClick={() => setQuery(s)}>
                    {s}
                  </button>
                ))}
            </div>
          </section>
        )}

        {(tab === "all" || tab === "videos") && (
          <section>
            <h2 className="section-heading">Videos</h2>
            <div className="resource-grid">
              {filteredVideos.map((v) => (
                <Card key={v._id} className="resource-card">
                  <div className="resource-thumb" />
                  <div className="resource-body">
                    <h3 className="resource-title">{v.title}</h3>
                    <p className="resource-desc">{v.description}</p>
                    <div className="resource-row">
                      <span className="muted-text">{v.cost} credits</span>
                      <Button onClick={() => navigate(`/video/${v._id}`)}>Watch</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {(tab === "all" || tab === "notes") && (
          <section>
            <h2 className="section-heading">Notes</h2>
            <div className="resource-grid">
              {filteredNotes.map((n) => (
                <Card key={n._id} className="resource-card">
                  <div className="resource-thumb notes-thumb">Notes</div>
                  <div className="resource-body">
                    <h3 className="resource-title">{n.title}</h3>
                    <div className="resource-row">
                      <span className="muted-text">{n.cost} credits</span>
                      <Button onClick={() => downloadNote(n._id || n.id)}>Download</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
