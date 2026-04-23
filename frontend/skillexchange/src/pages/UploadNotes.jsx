import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import "./UploadNotes.css";

export default function UploadNotes() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!file || !title.trim()) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("title", title);
      data.append("notes", file);
      await api.post("/notes", data);
      alert("Notes uploaded");
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
          <h1 className="page-title upload-title">Upload Notes</h1>
          <Input placeholder="Notes title" onChange={(e) => setTitle(e.target.value)} />
          <input
            className="upload-file"
            type="file"
            accept=".pdf,.doc,.txt"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button onClick={submit} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Notes"}
          </Button>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
