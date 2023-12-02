import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { setAuth, setLogout, setUser } from "./redux/slices/auth";
import type { RootState } from "./redux/store";

import LeftSidebar from "./components/shared/LeftSidebar";
import RightSidebar from "./components/shared/RightSidebar";
import BottomBar from "./components/shared/BottomBar";
import Auth from "./routes/Auth";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import CreatePost from "./routes/CreatePost";

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const user = useSelector((state: RootState) => state.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_REACT_BASE_URL}/api/user`,
          {
            method: "GET",
            headers: { authorization: token! },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          localStorage.removeItem("token");
          dispatch(setLogout());
          navigate("/");
        }
        dispatch(setUser(data));
      } catch (error: unknown) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      dispatch(setAuth(token));
      authenticate();
    }
    // eslint-disable-next-line
  }, []);

  if (!token)
    return (
      <Routes>
        <Route path="/" element={<Auth />} />
      </Routes>
    );

  return (
    <div>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <img
            src="/logo.svg"
            height={40}
            width={40}
            alt="loading"
            className="dark:invert animate-ping"
          />
        </div>
      ) : (
        <div className="flex flex-row justify-center">
          {<LeftSidebar user={user!} />}
          <main className="flex-1 max-w-[650px]">
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/create" element={<CreatePost />} />
            </Routes>
            {<BottomBar user={user!} />}
          </main>
          {<RightSidebar />}
        </div>
      )}
    </div>
  );
};

export default App;
