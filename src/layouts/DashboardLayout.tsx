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
    <div className="h-screen flex flex-col">
      <Header typeOfButton="logout" withBorder={true} />
      <div className="flex-1 flex overflow-hidden">
        <SideBar />
        <div className="size-full bg-primary/3 overflow-hidden overflow-y-auto scroll-hidden">
          <div className="max-w-3xl sm:m-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
