import { useLocation, Link } from "react-router-dom";
import { User as PropTypes } from "@/lib/types";
import { Bookmark, Home, Search, User } from "lucide-react";

const BottomBar = ({ user }: { user: PropTypes }) => {
  const { pathname } = useLocation();

  const navLinks = [
    { route: "/home", label: "Home", icon: Home },
    { route: "/search", label: "Search", icon: Search },
    { route: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { route: `/profile/${user?.username}`, label: "Profile", icon: User },
  ];

  return (
    <nav className="max-sm:flex hidden w-full p-1.5 border-t fixed bottom-0 left-0 justify-evenly items-center">
      {navLinks.map((link) => (
        <Link
          key={link.label}
          className={`p-3.5 py-3.5 rounded-full ${
            pathname.includes(link.route)
              ? "bg-muted font-medium"
              : "hover:bg-muted"
          } flex items-center transition-all ease-in-out duration-200`}
          to={link.route}
        >
          <link.icon size={20} />
        </Link>
      ))}
    </nav>
  );
};

export default BottomBar;
