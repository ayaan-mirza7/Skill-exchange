import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Protectedroute from "./components/protectedroute";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Homes";
import Video from "./pages/Video";
import UploadVideo from "./pages/UploadVideo";
import UploadNotes from "./pages/UploadNotes";
import Profile from "./pages/Profile";
import About from "./pages/About";

const router=createBrowserRouter([
    {path:"/",element:<Login />},
    {path:"/signup",element:<Signup />},
    {path:"/dashboard",
        element:(
            <Protectedroute>
                <Dashboard/>
            </Protectedroute>
        ),
    },
    { path: "/", element: <Home/> },
    { path: "/video/:id", element: <Video/> },

    { path: "/upload-video", element: <UploadVideo/> },
    { path:"/upload-notes", element:<UploadNotes/> },

    { path: "/upload", element: <UploadVideo/> },

    {path:"/profile", element:<Profile/>},
    {path:"/about", element:<About/>},

]);
export default router;