import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useUser } from "../context/UserContext";
import "./UploadNotes.css";

export default function UploadNotes() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState(3);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { updateCredits, refreshUser } = useUser();

  const submit = async () => {
    if (!file || !title.trim()) return;
    if (!Number.isFinite(Number(cost)) || Number(cost) <= 0) {
      alert("Please enter a valid credit cost.");
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append("title", title);
      data.append("cost", String(Math.floor(Number(cost))));
      data.append("notes", file);
      const res = await api.post("/notes", data);
      if (typeof res?.data?.credits === "number") {
        updateCredits(res.data.credits);
      }
      await refreshUser();
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
          <Input
            type="number"
            min="1"
            value={cost}
            placeholder="Unlock Cost (credits)"
            onChange={(e) => setCost(e.target.value)}
          />
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
