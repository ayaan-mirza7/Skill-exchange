import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ResourceThumb from "../components/ResourceThumb";
import ResourcePublisher from "../components/ResourcePublisher";
import "./Dashboard.css";
import "./AppPages.css";

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const [v, n] = await Promise.all([api.get("/videos"), api.get("/notes")]);
      setVideos(v.data || []);
      setNotes(n.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main dashboard-main">
        <h1 className="page-title">Dashboard</h1>

        {loading && <p className="muted-text">Loading content...</p>}

        <section>
          <h2 className="section-heading">Videos</h2>
          {videos.length === 0 ? (
            <div className="empty-state">No videos available right now.</div>
          ) : (
            <div className="resource-grid">
              {videos.map((v) => (
                <Card key={v._id} className="resource-card">
                  <ResourceThumb item={v} />
                  <div className="resource-body">
                    <h3 className="resource-title">{v.title}</h3>
                    <p className="resource-desc">{v.description}</p>
                    <ResourcePublisher item={v} />
                    <div className="resource-row">
                      <span className="muted-text">{v.cost} credits</span>
                      <Button onClick={() => navigate(`/video/${v._id}`)}>Watch</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-notes">
          <h2 className="section-heading">Notes</h2>
          {notes.length === 0 ? (
            <div className="empty-state">No notes available right now.</div>
          ) : (
            <div className="resource-grid">
              {notes.map((n) => (
                <Card key={n._id} className="resource-card">
                  <ResourceThumb item={n} type="notes" />
                  <div className="resource-body">
                    <h3 className="resource-title">{n.title}</h3>
                    <ResourcePublisher item={n} />
                    <div className="resource-row">
                      <span className="muted-text">{n.cost} credits</span>
                      <Button onClick={() => navigate(`/notes/${n._id}`)}>Review</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

      </main>
      <Footer />
    </div>
  );
}
