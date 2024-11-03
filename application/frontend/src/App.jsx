import "./App.css";
import "./styles/App.scss";
import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Game from "./components/Game";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Home from "./components/Home";
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
          path="game"
          element={
            <GameProvider>
              <Game />
            </GameProvider>
          }
        />
        <Route path="profile" element={<Profile userId={profileId ? profileId : userId ? userId : 1} />} />
        <Route path="dashboard" element={ isLoggedIn ? <Dashboard /> : <Navigate to="/" replace />} />
        {/*
         * All Routes use the DefaultLayout
         * <Route index element={<Home />} />
         * <Route path="lobby" element={<Lobby />} />
         * path="watch"
         * path="leaderboards"
         * path="profile"
         * path="dashboard"
         * path="game/practice"
         * path="game/[id]"
         */}
      </Route>
    </Routes>
  );
}
