import { Outlet } from "react-router-dom";
import Notification from "../components/Notification";

const RootLayout = () => {
  return (
    <div className="">
      <Notification />
      <Outlet />
    </div>
  );
};

export default RootLayout;
