import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/pages/Dashboard";
import Game from "./components/pages/Game";
import Home from "./components/pages/Home";
import Leaderboards from "./components/pages/Leaderboards";
import Profile from "./components/pages/Profile";
import Watch from "./components/pages/Watch";
import { GameProvider } from "./context/GameContext";
import DefaultLayout from "./layouts/DefaultLayout";
import useUserAuthStore from "./stores/userAuthStore";
import "./styles/App.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { GAME_URL, HOST_PATH, USER_URL } from "./scripts/constants";
import ErrorPage from "./components/pages/ErrorPage";
import useUserMetaDataStore from "./stores/userMetaDataStore";
import GameReview from "./components/pages/GameReview";
import GameVersus from "./components/pages/GameVersus";

export default function App() {
  const { isLoggedIn, userId } = useUserAuthStore();
  const { isMetaDataSet } = useUserMetaDataStore();
  const [games, setGames] = useState(null);
  const [profiles, setProfiles] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await axios.get(
          `${HOST_PATH}/users/?profiles=true`
        );
        const users = usersResponse.data;
        setProfiles(users);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };

    fetchUsers();

    const ws = new WebSocket(USER_URL);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log("WebSocket message received:", data);

      if (data.message === "New user created") {
        fetchUsers();
      }
    };

    return () => {
      ws.close();
    };
  }, [location.pathname]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const usersResponse = await axios.get(`${HOST_PATH}/games`);
        const games = usersResponse.data;
        setGames(games);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();

    const ws = new WebSocket(GAME_URL);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log("WebSocket message received:", data);

      if (data.message === "New game created") {
        fetchGames();
      }
    };

    return () => {
      ws.close();
    };
  }, [location.pathname]);

  // Save before logged in user leaves website
  useEffect(() => {
    if (!userId || !isMetaDataSet) return;

    const handleUserMetaData = async () => {
      const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));
      const formData = {
        user_id: userId,
        settings: store.state.settings,
        user_points: store.state.points,
        items: store.state.items,
      };

      try {
        await axios.post(`${HOST_PATH}/update-user-metadata/`, formData);
      } catch (error) {
        console.error(error);
      }
    };
    window.addEventListener("beforeunload", handleUserMetaData);
    return () => {
      window.removeEventListener("beforeunload", handleUserMetaData);
    };
  }, [isMetaDataSet, userId]);

  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="*" element={<ErrorPage />} />
        <Route index element={<Home />} />
        <Route path="leaderboards" element={<Leaderboards />} />
        <Route path="watch" element={<Watch />} />

        <Route
          path="dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" replace />}
        />

        <Route
          path="play"
          element={
            <GameProvider>
              <Game />
            </GameProvider>
          }
        />

        <Route
          path="versus"
          element={
            <GameProvider>
              <GameVersus />
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
                    profileUserId={value.id}
                    username={value.username}
                    dateJoined={value.date_joined}
                    lastLogin={value.last_login}
                  />
                }
              />
            ))
          : null}

        {games
          ? Object.entries(games).map(([key, value]) => (
              <Route
                path={`game/game_id_${value.id}`}
                key={key}
                element={
                  <GameReview />
                }
              />
            ))
          : null}

        <Route path="profile" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
