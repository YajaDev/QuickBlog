import { NavLink, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearSession } from "../reduxStore/authSlice";
import { supabase } from "../services/supabaseService";

export type TypeOfButton = "dashboard" | "auth" | "home" | "logout";

interface Props {
  typeOfButton: TypeOfButton;
  withBorder?: boolean;
}

interface Button {
  type: TypeOfButton;
  label: string;
  path: string;
}

const buttons: Button[] = [
  { type: "dashboard", label: "Dashboard", path: "Dashboard" },
  { type: "auth", label: "Login", path: "auth" },
  { type: "home", label: "Home", path: "/" },
  { type: "logout", label: "logout", path: "/" },
];

const Header = ({ typeOfButton, withBorder }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const headerBtn = buttons.find((btn) => btn.type === typeOfButton);

  const handleButton = async () => {
    if (typeOfButton === "logout") {
      await supabase.auth.signOut();
      navigate("/", { replace: true });
      dispatch(clearSession());
      return;
    }

    if (headerBtn) navigate(headerBtn.path);
  };

  return (
    <header
      className={`flex items-center justify-between py-2 h-[70px] border-gray-200 ${
        withBorder && "border-b px-4 sm:px-12"
      }`}
    >
      <NavLink to="/">
        <h1>
          <span className="text-primary tracking-wider">Q</span>uickblog
        </h1>
      </NavLink>

      {headerBtn && (
        <button
          onClick={handleButton}
          className="flex items-center bg-primary text-primary-foreground text-sm px-4 py-2 rounded-full capitalize"
        >
          {headerBtn.label}
          <ArrowRight className="ml-1 size-4" />
        </button>
      )}
    </header>
  );
};

export default Header;
