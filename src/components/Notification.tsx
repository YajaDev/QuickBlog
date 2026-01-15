import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../reduxStore/store";
import { useEffect } from "react";
import { setNotification } from "../reduxStore/notificationSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const { status, message } = useSelector(
    (state: RootState) => state.notification
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setNotification({status: null, message: ""}));
    }, 1500);

    return () => clearTimeout(timer);
  }, [status, message, dispatch]);

  if (!status) return; // return null if there is no notification

  const variant = {
    error: {
      backgroundColor: "#fee2e2", // red-100
      color: "#dc2626", // red-600
    },
    success: {
      backgroundColor: "#dcfce7", // green-100
      color: "#16a34a", // green-600
    },
  };

  return (
    <div className="fixed flex justify-center top-6 z-60 w-full">
      <div
        style={variant[status]}
        className="inline-flex items-center justify-center gap-2 text-sm p-3 md:py-5 mx-5 rounded"
      >
        <span className="text-center text-pretty">{message}</span>
      </div>
    </div>
  );
};

export default Notification;
