import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import "./Dashboard.css";

export default function Dashboard() {

  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);

  const navigate = useNavigate();

  
  const load = async () => {
    const v = await api.get("/videos");
    const n = await api.get("/notes");

    setVideos(v.data);
    setNotes(n.data);
  };

  useEffect(()=>{
    load();
  },[]);

  return (
    <div className="page-container" style={{ paddingBottom: 80 }}>
      <Navbar />
      <main className="content">
        <h2 className="section-title">📺 Videos</h2>
        <div className="videos-list">
          {videos.map((v) => (
            <div key={v._id} className="video-card">
              {/* Thumbnail (can add image later) */}
              <div className="video-thumbnail"></div>

              <div className="video-info">
                <h3 className="video-title">{v.title}</h3>

                <p className="video-desc">{v.description}</p>

                <div className="video-meta">
                  <span>{v.cost} credits</span>

                  <button
                    className="watch-btn"
                    onClick={() => navigate(`/video/${v._id}`)}
                  >
                    Watch
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="section-title">📁 Notes</h2>

        <div className="notes-list">
          {notes.map((n) => (
            <div key={n._id} className="note-card">
              <div className="note-icon">📄</div>

              <div className="note-info">
                <h3 className="note-title">{n.title}</h3>

                <button className="download-btn">Download</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bottom-action-bar">
          <button
            className="action-btn video-btn"
            onClick={() => navigate("/upload-video")}
          >
            ➕ Upload Video
          </button>

          <button
            className="action-btn notes-btn"
            onClick={() => navigate("/upload-notes")}
          >
            ➕ Upload Notes
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
