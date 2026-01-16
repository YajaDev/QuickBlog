import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export interface RedirectBtn {
  name: string;
  to: "dashboard" | "auth" | "/";
}

interface Props {
  redirectBtn?: RedirectBtn;
  withBorder?: boolean;
}

const Header = ({ redirectBtn, withBorder }: Props) => {
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
      {redirectBtn && (
        <NavLink
          to={`${redirectBtn.to}`}
          className="flex items-center bg-primary text-primary-foreground text-sm px-4 py-2 rounded-full"
        >
          {redirectBtn.name}
          <ArrowRight className="ml-1 size-4" />
        </NavLink>
      )}
    </header>
  );
};

export default Header;
