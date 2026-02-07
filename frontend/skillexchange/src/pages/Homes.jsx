import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Home() {

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/videos");
      setVideos(res.data);
    };

    load();
  }, []);

  return (
    <div>
      <h1>Skill Videos</h1>

      {videos.map(v => (
        <div key={v._id} style={{border:"1px solid gray", margin:10, padding:10}}>

          <h3>{v.title}</h3>

          <p>{v.description}</p>

          <p>Cost: {v.cost} credits</p>

          <Link to={`/video/${v._id}`}>
            Open
          </Link>

        </div>
      ))}

    </div>
  );
}
