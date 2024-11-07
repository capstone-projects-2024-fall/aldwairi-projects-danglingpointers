import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/pages/Dashboard";
import Game from "./components/pages/Game";
import Home from "./components/pages/Home";
import Leaderboards from "./components/pages/Leaderboards";
import Lobby from "./components/pages/Lobby";
import Profile from "./components/pages/Profile";
import Watch from "./components/pages/Watch";
import { GameProvider } from "./context/GameContext";
import DefaultLayout from "./layouts/DefaultLayout";
import useUserAuthStore from "./stores/userAuthStore";
import "./styles/App.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { HOST_PATH } from "./scripts/constants";
import ErrorPage from "./components/pages/ErrorPage";

export default function App() {
  const { isLoggedIn } = useUserAuthStore();
  const [profiles, setProfiles] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const usersResponse = await axios.get(`${HOST_PATH}/users`);
        const users = usersResponse.data;
        setProfiles(users);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };

    fetchUserItems();
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="*" element={<ErrorPage />} />
        <Route index element={<Home />} />
        <Route path="leaderboards" element={<Leaderboards />} />
        <Route path="lobby" element={<Lobby />} />
        <Route path="watch" element={<Watch />} />

        <Route
          path="dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" replace />}
        />

        <Route
          path="practice"
          element={
            <GameProvider>
              <Game />
            </GameProvider>
          }
        />

        {profiles
          ? Object.entries(profiles).map(([key, value]) => (
              <Route
                path={`profile/${value.username}`}
                key={key}
                element={
                  <Profile
                    userId={value.id}
                    username={value.username}
                    dateJoined={value.date_joined}
                    lastLogin={value.last_login}
                  />
                }
              />
            ))
          : null}
          
        <Route path="profile" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
