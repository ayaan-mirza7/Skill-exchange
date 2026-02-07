import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../api";

export default function Video() {

  const { id } = useParams();
  const [path, setPath] = useState("");

  const play = async () => {

    try {
      const res = await api.post(`/videos/watch/${id}`);

      // 🔹 convert path to URL
      setPath("http://localhost:5000/" + res.data.path);

    } catch (err) {
      alert("Not enough credits");
    }
  };

  return (
    <div>

      {!path && (
        <button onClick={play}>
          Unlock & Play
        </button>
      )}

      {path && (
        <video controls width="500" src={path}></video>
      )}

    </div>
  );
}
