import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import "./myskill.css";

export default function MySkill() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);

  const navigate = useNavigate();

  const load = async () => {
    try {
      const p = await api.get("/user/profile");
      setUser(p.data);

      const v = await api.get("/videos");
      const n = await api.get("/notes");

      // filter uploads by current user (field name may vary)
      const uid = p.data._id || p.data.id;

      const myVideos = v.data.filter((item) => {
        return (
          item.uploadedBy === uid ||
          item.uploadedby === uid ||
          (item.uploadedBy && item.uploadedBy._id === uid)
        );
      });

      const myNotes = n.data.filter((item) => {
        return (
          item.uploadedBy === uid ||
          item.uploadedby === uid ||
          (item.uploadedBy && item.uploadedBy._id === uid)
        );
      });

      setVideos(myVideos);
      setNotes(myNotes);
    } catch (err) {
      console.error(err);
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
        { responseType: "blob" }
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

  return (
    <div className="page-container" style={{ paddingBottom: 80 }}>
      <Navbar />
      <main className="content">
        <h2 className="section-title">My Uploaded Videos</h2>

        <div className="videos-list">
          {videos.length === 0 && <p>No uploaded videos yet.</p>}
          {videos.map((v) => (
            <div key={v._id} className="video-card">
              <div className="video-thumbnail"></div>
              <div className="video-info">
                <h3 className="video-title">{v.title}</h3>
                <p className="video-desc">{v.description}</p>
                <div className="video-meta">
                  <span>{v.cost} credits</span>
                  <button className="watch-btn" onClick={() => navigate(`/video/${v._id}`)}>
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="section-title">My Uploaded Notes</h2>

        <div className="notes-list">
          {notes.length === 0 && <p>No uploaded notes yet.</p>}
          {notes.map((n) => (
            <div key={n._id} className="note-card">
              <div className="note-icon">📄</div>
              <div className="note-info">
                <h3 className="note-title">{n.title}</h3>
                <button className="download-btn" onClick={() => downloadNote(n._id || n.id)}>
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
// // import React from 'react'
// import Navbar from "../components/navbar";
// import Footer from "../components/footer";

// function myskill() {
//   return (
//     <>
//       <Navbar />
//       <div>
//         <h1>My Skills</h1>
//       </div>
//       <Footer />
//     </>
//   )
// }

// export default myskill
