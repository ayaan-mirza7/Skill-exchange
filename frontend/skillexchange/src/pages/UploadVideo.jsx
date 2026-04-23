import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import "./UploadVideo.css";

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!file || !title.trim()) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("title", title);
      data.append("description", description);
      data.append("video", file);
      await api.post("/videos", data);
      alert("Video uploaded!");
      navigate("/dashboard");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main upload-page">
        <Card className="upload-container">
          <h1 className="page-title upload-title">Upload Video</h1>
          <Input placeholder="Video title" onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
          <input
            className="upload-file"
            type="file"
            accept="video/mp4, video/webm, video/mkv"
            required
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button onClick={submit} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Video"}
          </Button>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
