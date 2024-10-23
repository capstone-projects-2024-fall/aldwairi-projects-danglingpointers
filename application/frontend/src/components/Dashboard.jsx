import Store from "./dashboard-components/Store";

export default function Dashboard() {
  return (
    <main className="main-dashboard">
      <div className="inbox-placeholder"></div>
      <Store />
      <div className="game-history-placeholder"></div>
      <div className="best-history-placeholder"></div>
      <div className="settings-placeholder"></div>
      <div className="stats-placeholder"></div>
    </main>
  );
}
