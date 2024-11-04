import "./App.css";
import "./styles/App.scss";
import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Game from "./components/pages/Game";
import Dashboard from "./components/pages/Dashboard";
import Profile from "./components/pages/Profile";
import Home from "./components/pages/Home";
import Watch from "./components/pages/Watch";
import Lobby from "./components/pages/Lobby";
import Leaderboards from "./components/pages/Leaderboards";
import { GameProvider } from "./context/GameContext";
import useUserAuthStore from "./stores/userAuthStore";
import useUserProfileStore from "./stores/userProfileStore";

export default function App() {
  const { isLoggedIn, userId } = useUserAuthStore();
  const { profileId } = useUserProfileStore();
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route
          path="practice"
          element={
            <GameProvider>
              <Game />
            </GameProvider>
          }
        />
        <Route
          path="profile"
          element={
            <Profile userId={profileId ? profileId : userId ? userId : 1} />
          }
        />
        <Route
          path="dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route path="watch" element={<Watch />} />
        <Route path="lobby" element={<Lobby />} />
        <Route path="leaderboards" element={<Leaderboards />} />
      </Route>
    </Routes>
  );
}
