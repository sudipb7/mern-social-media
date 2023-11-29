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

export default function App() {
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
          {token && <LeftSidebar user={user!} />}
          <main className="flex-1 max-w-[650px]">
            <Routes>
              <Route
                path="/"
                element={!token ? <Auth /> : <Navigate to="/home" />}
              />
              <Route
                path="/home"
                element={token ? <Home /> : <Navigate to="/" />}
              />
              <Route
                path="/profile/:username"
                element={token ? <Profile /> : <Navigate to="/" />}
              />
              <Route
                path="/create"
                element={token ? <CreatePost /> : <Navigate to="/" />}
              />
            </Routes>
            {token && <BottomBar user={user!} />}
          </main>
          {token && <RightSidebar />}
        </div>
      )}
    </div>
  );
}
