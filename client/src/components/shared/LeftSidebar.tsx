import { useLocation, Link } from "react-router-dom";
import { Bookmark, Home, ImagePlus, Settings, User } from "lucide-react";
import type { User as PropTypes } from "@/lib/types";

const LeftSidebar = ({ user }: { user: PropTypes }) => {
  const { pathname } = useLocation();

  const navLinks = [
    { route: "/home", label: "Home", icon: Home },
    { route: "/create", label: "Create", icon: ImagePlus },
    { route: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { route: `/profile/${user?.username}`, label: "Profile", icon: User },
    { route: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <header className="max-sm:hidden w-fit lg:w-[300px] xl:w-[340px] p-3 md:p-5 lg:p-3 h-screen border-r sticky top-0 left-0 flex justify-start items-start">
      <nav className="max-lg:w-full mx-auto flex flex-col justify-center max-md:items-center items-start gap-2">
        <Link className="px-6 py-4 my-4" to="/home">
          <img
            src="/logo.svg"
            alt="X Logo"
            width={25}
            height={25}
            className="dark:invert"
          />
        </Link>

        {navLinks.map((link) => (
          <Link
            key={link.label}
            className={`p-6 py-5 lg:py-3.5 rounded-full ${
              pathname.includes(link.route)
                ? "bg-muted font-medium"
                : "hover:bg-muted"
            } flex items-center transition-all ease-in-out duration-200`}
            to={link.route}
          >
            <link.icon className="lg:mr-3" />
            <span className="mr-1.5 max-lg:hidden">{link.label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default LeftSidebar;
