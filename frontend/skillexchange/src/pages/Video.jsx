import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import "./Video.css";

export default function Video() {
  const { id } = useParams();
  const [path, setPath] = useState("");
  const [title, setTitle] = useState("Video Player");
  const [description, setDescription] = useState("Unlock to start learning this skill.");
  const [loading, setLoading] = useState(false);

  const play = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/videos/watch/${id}`);
      setPath("http://localhost:5000/" + res.data.path);
      setTitle(res.data.title || "Video Unlocked");
      setDescription(res.data.description || "Enjoy the lesson.");
    } catch (err) {
      alert("Not enough credits");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main video-page">
        <Card className="video-player-card">
          <div className="player-wrap">
            {path ? (
              <video controls src={path} className="video-element" />
            ) : (
              <div className="video-placeholder">Preview locked</div>
            )}
          </div>
          <div className="video-details">
            <h1 className="page-title">{title}</h1>
            <p className="muted-text">{description}</p>
            {!path && (
              <Button onClick={play} disabled={loading}>
                {loading ? "Unlocking..." : "Unlock & Play"}
              </Button>
            )}
            {path && <p className="muted-text">Credits were deducted only once for this unlock.</p>}
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
