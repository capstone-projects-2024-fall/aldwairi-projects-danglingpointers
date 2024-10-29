import "./App.css";
import "./styles/App.scss";
import { Routes, Route } from "react-router-dom";
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import SignupPage from './components/SignupPage';
import HomePage from './components/HomePage';

import DefaultLayout from "./layouts/DefaultLayout";
import Game from "./components/Game";

export default function App() {
  return (
    <Routes>
      {/* Routes using DefaultLayout */}
      <Route element={<DefaultLayout />}>

      {/* HomePage Route */}
      <Route path="/" element={<HomePage />} />

      {/* LoginPage Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Dashboard Route */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/*Signup Page route*/}
      <Route path="/Signup" element={<SignupPage />} />

      {/* Game Route */}
      <Route path="/game" element={<Game />} />
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
