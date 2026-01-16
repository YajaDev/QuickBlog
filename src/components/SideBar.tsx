import { Dock, SquarePlus } from "lucide-react";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  const links = [
    { name: "Dashboard", Icon: Dock, path: "/dashboard" },
    { name: "Add blogs", Icon: SquarePlus, path: "addblog" },
  ];

  return (
    <aside className="border-r border-gray-200 pt-5">
      {links.map(({ name, Icon, path }) => (
        <NavLink
          key={name}
          to={path}
          end
          className={({ isActive }) =>
            `block p-3 sm:px-6 sm:py-4 ${
              isActive && "bg-primary/10 border-r-4 border-primary"
            }`
          }
        >
          <div className="flex gap-3 md:w-60">
            <Icon className="stroke-1" />
            <span className="max-sm:hidden">{name}</span>
          </div>
        </NavLink>
      ))}
    </aside>
  );
};

export default SideBar;
