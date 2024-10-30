import "./App.css";
import "./styles/App.scss";
import { Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Game from "./components/Game";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Game />} />
        <Route path="dashboard" element={<Dashboard />} />
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
