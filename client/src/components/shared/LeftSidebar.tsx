import { useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTheme } from "@/context/theme-provider";
import { setLogout } from "@/redux/slices/auth";
import type { User as PropTypes } from "@/lib/types";

import { Button } from "../ui/button";
import {
  Bookmark,
  Feather,
  Home,
  LogOut,
  MonitorSmartphone,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CreatePostForm from "../forms/CreatePostForm";

const LeftSidebar: React.FC<{ user: PropTypes }> = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { setTheme } = useTheme();

  const navLinks = [
    { route: "/home", label: "Home", icon: Home },
    { route: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { route: `/profile/${user?.username}`, label: "Profile", icon: User },
    { route: "/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(setLogout());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="max-sm:hidden w-fit lg:w-[300px] xl:w-[340px] p-3 h-screen border-r sticky top-0 left-0 flex justify-start items-start">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-6 py-5 lg:py-3.5 rounded-full hover:bg-muted flex items-center transition-all ease-in-out duration-200">
              <Sun className="lg:mr-3 dark:hidden" />
              <Moon className="lg:mr-3 hidden dark:block" />
              <span className="mr-1.5 max-lg:hidden">Display</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              className="flex items-center"
              onClick={() => setTheme("light")}
            >
              <Sun size={18} className="mr-3" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center"
              onClick={() => setTheme("dark")}
            >
              <Moon size={18} className="mr-3" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center"
              onClick={() => setTheme("system")}
            >
              <MonitorSmartphone size={18} className="mr-3" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog>
          <DialogTrigger asChild>
            <button className="p-6 py-5 lg:py-3.5 rounded-full hover:bg-muted flex items-center transition-all ease-in-out duration-200">
              <LogOut className="lg:mr-3" />
              <span className="mr-1.5 max-lg:hidden">Log out</span>
            </button>
          </DialogTrigger>
          <DialogContent className="w-[300px] rounded-xl">
            <DialogHeader className="my-2">
              <img
                src="/logo.svg"
                alt="X Logo"
                width={30}
                height={30}
                className="mx-auto mb-3 dark:invert"
              />
              <DialogTitle className="text-3xl text-justify font-bold">
                Log out of X?
              </DialogTitle>
              <DialogDescription>
                You can always log back in at any time.
              </DialogDescription>
            </DialogHeader>

            <div className="w-full flex flex-col gap-3">
              <Button
                variant="destructive"
                size="lg"
                className="rounded-full font-medium"
                onClick={handleLogout}
              >
                Log out
              </Button>
              <DialogClose asChild>
                <Button
                  size="lg"
                  className="rounded-full font-medium"
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <button className="mt-3 w-fit lg:w-full hidden sm:block py-4 px-5 lg:py-3.5 rounded-full text-white bg-[#1D9BF0] hover:bg-[#1A8CD8] transition-all ease-linear duration-200">
              <Feather className="lg:hidden w-full text-center" size={20} />
              <span className="max-lg:hidden w-full text-center font-semibold">
                Post
              </span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[450px]">
            <CreatePostForm />
          </DialogContent>
        </Dialog>
      </nav>
    </header>
  );
};

export default LeftSidebar;
