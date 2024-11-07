import { Outlet } from "react-router-dom";
import Navigation from '../components/Navigation'; // Importing the Navigation component

export default function DefaultLayout() {
  return (
    <div className="default-layout">
      {/* Include the Navigation component */}
      <Navigation />

      <Outlet />
    </div>
  );
}
