import "./App.css";
import "./styles/App.scss";
import { Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Game from "./components/Game";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Home from "./components/Home";
import { GameProvider } from "./context/GameContext";

export default function App() {
  const userId = 1; //REPLACE IN FUTURE
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="game" element={<GameProvider><Game /></GameProvider>} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile userId={userId} />} />
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
