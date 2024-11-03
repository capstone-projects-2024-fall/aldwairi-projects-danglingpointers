import Store from "../dashboard-components/Store";
import Settings from "../dashboard-components/Settings";
import UserPreviousGames from "../dashboard-components/UserPreviousGames";
import UserLeaderboards from "../dashboard-components/UserLeaderboards";
import UserStats from "../dashboard-components/UserStats";

export default function Dashboard() {
  return (
    <main className="main-dashboard">
      <div key="inbox" className="inbox">
        Inbox
      </div>
      <Store />
      <Settings />
      <UserLeaderboards />
      <UserPreviousGames />
      <UserStats />
    </main>
  );
}
