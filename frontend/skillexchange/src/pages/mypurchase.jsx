import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import "./mypurchase.css";

export default function MyPurchase() {
  const [purchases, setPurchases] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try {
      // Try to fetch accesses (backend may not expose this endpoint)
      const acc = await api.get("/accesses");

      const v = await api.get("/videos");
      const vids = v.data;

      // map accesses to videos
      const videoIds = acc.data.map((a) => (a.videoId ? (a.videoId._id || a.videoId) : a.video));

      const purchasedVideos = vids.filter((vv) => videoIds.includes(vv._id));

      setVideos(purchasedVideos);
      setPurchases(acc.data);
    } catch (err) {
      // endpoint likely not available — keep empty and show helpful message
      setPurchases([]);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-container" style={{ paddingBottom: 80 }}>
      <Navbar />
      <main className="content">
        <h2 className="section-title">My Purchases</h2>

        {loading && <p>Loading purchases…</p>}

        {!loading && videos.length === 0 && (
          <div>
            <p>No purchases found or purchases endpoint is not available on the server.</p>
            <button onClick={() => navigate('/explore')}>Explore and Purchase</button>
          </div>
        )}

        <div className="videos-list">
          {videos.map((v) => (
            <div key={v._id} className="video-card">
              <div className="video-thumbnail"></div>
              <div className="video-info">
                <h3 className="video-title">{v.title}</h3>
                <p className="video-desc">{v.description}</p>
                <div className="video-meta">
                  <span>{v.cost} credits</span>
                  <button className="watch-btn" onClick={() => navigate(`/video/${v._id}`)}>
                    Play
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
// import React from "react";
// import Navbar from "../components/navbar";
// import Footer from "../components/footer";

// function mypurchase() {
//   return (
//     <>
//       <Navbar />
//       <div>
//         <h1>My Purchases</h1>
//       </div>
//       <Footer />
//     </>
//   );
// }

// export default mypurchase;
