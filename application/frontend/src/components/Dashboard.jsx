import Store from "./dashboard-components/Store";

export default function Dashboard() {
  return (
    <main className="main-dashboard">
      <h1>Dashboard is working!</h1> {/* Temporary content to check rendering */}

      <div className="inbox-placeholder"></div>
      <Store />
      <div className="game-history-placeholder"></div>
      <div className="best-history-placeholder"></div>
      <div className="settings-placeholder"></div>
      <div className="stats-placeholder"></div>
    </main>
  );
}
