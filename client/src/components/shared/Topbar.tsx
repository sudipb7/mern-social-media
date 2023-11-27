import type { User } from "@/lib/types";
import { ModeToggle } from "../mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import MobileMenu from "./MobileMenu";

const Topbar = ({ user }: { user: User }) => {
  return (
    <header className="w-full py-2 px-6 max-sm:flex hidden justify-between items-center sticky top-0 left-0">
      <Sheet>
        <SheetTrigger asChild>
          <img
            src={user?.img?.secure_url ? user?.img?.secure_url : "/default.png"}
            alt="Profile picture"
            width={30}
            height={30}
            className="rounded-full object-cover"
          />
        </SheetTrigger>
        <SheetContent side="left">
          <MobileMenu user={user} />
        </SheetContent>
      </Sheet>
      <img
        src="/logo.svg"
        alt="X logo"
        width={25}
        height={25}
        className="dark:invert"
      />
      <ModeToggle />
    </header>
  );
};

export default Topbar;
