import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import "./mypurchase.css";
import "./AppPages.css";

export default function MyPurchase() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [acc, v] = await Promise.all([api.get("/accesses"), api.get("/videos")]);
        const ids = (acc.data || []).map((a) => (a.videoId ? a.videoId._id || a.videoId : a.video));
        setVideos((v.data || []).filter((video) => ids.includes(video._id)));
      } catch (err) {
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main purchases-main">
        <h1 className="page-title">My Purchases</h1>

        {loading && <p className="muted-text">Loading purchases...</p>}

        {!loading && videos.length === 0 && (
          <div className="empty-state purchases-empty">
            <p>No purchases found yet.</p>
            <Button onClick={() => navigate("/explore")}>Browse Explore Page</Button>
          </div>
        )}

        <div className="resource-grid">
          {videos.map((v) => (
            <Card key={v._id} className="resource-card">
              <div className="resource-thumb" />
              <div className="resource-body">
                <h3 className="resource-title">{v.title}</h3>
                <p className="resource-desc">{v.description}</p>
                <div className="resource-row">
                  <span className="muted-text">{v.cost} credits</span>
                  <Button onClick={() => navigate(`/video/${v._id}`)}>Play</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
