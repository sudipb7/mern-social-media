import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import type { User as PropTypes } from "@/lib/types";
import { useTheme } from "@/context/theme-provider";
import { setLogout } from "@/redux/slices/auth";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Bookmark,
  LogOut,
  MonitorSmartphone,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
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

const MobileMenu: React.FC<{ user: PropTypes }> = ({ user }) => {
  const { setTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navLinks = [
    { route: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { route: `/profile/${user?.username}`, label: "Profile", icon: User },
  ];

  const handleLogout = () => {
    dispatch(setLogout());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="w-full flex flex-col justify-center items-center">
      <div className="w-full flex flex-col justify-start items-start gap-2.5">
        <img
          onClick={() => navigate(`/profile/${user?.username}`)}
          src={user?.img?.secure_url ? user?.img?.secure_url : "/default.png"}
          alt="Profile picture"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />

        <div onClick={() => navigate(`/profile/${user?.username}`)}>
          <h4 className="font-semibold text-lg">{user?.name}</h4>
          <h5 className="text-muted-foreground font-light">
            @{user?.username}
          </h5>
        </div>

        <div className="w-full flex items-center gap-3.5">
          <p className="font-medium">
            {user?.followings.length}{" "}
            <span className="text-muted-foreground font-light">Following</span>
          </p>
          <p className="font-medium">
            {user?.followers.length}{" "}
            <span className="text-muted-foreground font-light">Followers</span>
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col justify-start items-start mt-4 gap-1.5">
        {navLinks.map((i) => (
          <Link
            key={i.label}
            className={`py-2 w-full hover:bg-muted flex items-center transition-all ease-in-out duration-200`}
            to={i.route}
          >
            <i.icon className="mr-3" />
            <span className="mr-1.5">{i.label}</span>
          </Link>
        ))}
      </div>

      <Separator className="my-4" />
      <Accordion className="w-full" type="multiple">
        <AccordionItem className="w-full" value="item-1">
          <AccordionTrigger>Settings and Support</AccordionTrigger>
          <AccordionContent asChild>
            <Link
              className="p-3 w-full hover:bg-muted flex items-center transition-all ease-in-out duration-200"
              to="/settings"
            >
              <Settings className="mr-3" />
              <span className="mr-1.5">Settings and privacy</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-3 w-full hover:bg-muted flex items-center transition-all ease-in-out duration-200">
                  <Sun className="mr-3 dark:hidden" />
                  <Moon className="mr-3 hidden dark:block" />
                  <span className="mr-1.5">Display</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-3" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-3" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <MonitorSmartphone className="mr-3" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DialogTrigger asChild>
                <button className="p-3 w-full hover:bg-muted flex items-center transition-all ease-in-out duration-200">
                  <LogOut className="mr-3" />
                  <span className="mr-1.5">Log out</span>
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </nav>
  );
};

export default MobileMenu;
