import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useSelector } from "react-redux";
import type { RootState } from "../reduxStore/store";

const DashboardLayout = () => {
  const { session } = useSelector((state: RootState) => state.auth);

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header typeOfButton="logout" withBorder={true} />
      <div className="flex-1 max-w-[100vw] flex">
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
