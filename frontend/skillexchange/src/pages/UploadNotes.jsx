import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import './UploadNotes.css';
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

export default function UploadNotes(){

  const [file,setFile] = useState(null);
  const [title,setTitle] = useState("");

  const navigate = useNavigate();

  const submit = async ()=>{

    const data = new FormData();

    data.append("title",title);
    data.append("notes",file);

    await api.post("/notes",data);

    alert("Notes uploaded");

    navigate("/dashboard");
  };

  return (
    <>
      <Navbar />
      <div className="upload-card">
        <h2>Upload Notes from PC</h2>

        <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />

        <input
          type="file"
          accept=".pdf,.doc,.txt"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={submit}>Upload</button>
      </div>

      <Footer />
    </>
  );
}
