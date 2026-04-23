import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Protectedroute from "./components/protectedroute";
import Dashboard from "./pages/Dashboard";
import Video from "./pages/Video";
import UploadVideo from "./pages/UploadVideo";
import UploadNotes from "./pages/UploadNotes";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Explore from "./pages/explore";
import MySkill from "./pages/myskill";
import MyPurchase from "./pages/mypurchase";

const withAuth = (node) => <Protectedroute>{node}</Protectedroute>;

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/dashboard", element: withAuth(<Dashboard />) },
  { path: "/video/:id", element: withAuth(<Video />) },
  { path: "/upload-video", element: withAuth(<UploadVideo />) },
  { path: "/upload-notes", element: withAuth(<UploadNotes />) },
  { path: "/upload", element: withAuth(<UploadVideo />) },
  { path: "/profile", element: withAuth(<Profile />) },
  { path: "/about", element: withAuth(<About />) },
  { path: "/explore", element: withAuth(<Explore />) },
  { path: "/skills", element: withAuth(<MySkill />) },
  { path: "/purchases", element: withAuth(<MyPurchase />) },
]);

export default router;
