import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import './UploadVideo.css';
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

export default function UploadVideo() {

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const submit = async () => {

    const data = new FormData();

    data.append("title", title);
    data.append("description", description);
    data.append("video", file);     // 🔹 PC VIDEO

    await api.post("/videos", data);

    alert("Video uploaded!");
    navigate("/dashboard");
  };

  return (
    <>
      <Navbar />
      <div className="upload-container">
        <h2 className="upload-title">Upload Video from PC</h2>

        <input
          className="upload-input"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="upload-input"
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="upload-file"
          type="file"
          accept="video/mp4, video/webm, video/mkv"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="upload-btn" onClick={submit}>
          Upload
        </button>
      </div>

      <Footer />
    </>
  );
}
