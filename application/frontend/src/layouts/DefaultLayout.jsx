import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
  return (
    <div className="default-layout">
      {/** HEADER NAVIGATION GOES HERE */}
      <Outlet />
    </div>
  );
}
