import { Outlet } from "react-router-dom";
import Notification from "../components/Notification";

const RootLayout = () => {
  return (
    <>
      <Notification />
      <Outlet />
    </>
  );
};

export default RootLayout;
