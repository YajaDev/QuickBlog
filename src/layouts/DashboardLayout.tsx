import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header redirectBtn={{ name: "Logout", to: "/" }} withBorder={true} />
      <div className="flex-1 max-w-[100vw] flex">
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
