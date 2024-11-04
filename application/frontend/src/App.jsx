import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import TestLeaderboardEntry from './components/entries/TestLeaderboardEntry';
import Game from './components/Game';
import Home from './components/Home';
import Leaderboards from './components/Leaderboards';
import Lobby from './components/Lobby';
import Profile from './components/Profile';
import Watch from './components/Watch';
import { GameProvider } from './context/GameContext';
import DefaultLayout from './layouts/DefaultLayout';
import useUserAuthStore from './stores/userAuthStore';
import useUserProfileStore from './stores/userProfileStore';
import './styles/App.scss';

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
                <Route path="dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" replace />} />
                <Route path="watch" element={<Watch />} />
                <Route path="lobby" element={<Lobby />} />
                <Route path="leaderboards" element={<Leaderboards />} />
                <Route path="test-leaderboard-entry" element={<TestLeaderboardEntry />} />
            </Route>
        </Routes>
    );
}
