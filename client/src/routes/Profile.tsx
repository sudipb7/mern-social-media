import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import type { RootState } from "@/redux/store";
import type { User } from "@/lib/types";

import { useToast } from "@/components/ui/use-toast";
import { setUser } from "@/redux/slices/auth";
import { dateFormatter } from "@/lib/utils";

import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Briefcase,
  CalendarDaysIcon,
  Link as LinkIcon,
  Loader2,
  LucideIcon,
  Mail,
  MapPin,
} from "lucide-react";

const Profile: React.FC = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [exists, setExists] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<User | null>(null);

  const currentUser = useSelector((state: RootState) => state.auth?.user);
  const joinedAt = dateFormatter(`${profile?.createdAt}`);

  const details: { icon: LucideIcon; value: string | null | undefined }[] = [
    { icon: Mail, value: profile?.email },
    { icon: Briefcase, value: profile?.profession },
    { icon: MapPin, value: profile?.location },
    { icon: LinkIcon, value: profile?.link },
    { icon: CalendarDaysIcon, value: `Joined ${joinedAt}` },
  ];

  const tabLists = [
    { value: "posts", label: "Posts", routes: "/" },
    { value: "replies", label: "Replies", routes: "/replies" },
    { value: "media", label: "Media", routes: "/media" },
    { value: "likedPosts", label: "Likes", routes: "/liked" },
  ];

  const getUser = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_REACT_BASE_URL}/api/user/profile/${
          params.username
        }`,
        {
          method: "GET",
          headers: { authorization: localStorage.getItem("token")! },
        }
      );
      const data = await response.json();
      if (response.status === 404) {
        setExists(false);
        toast({ variant: "destructive", title: data?.message });
        return;
      }
      setProfile(data);
      if (params.username === currentUser?.username) dispatch(setUser(data));
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line
  }, []);

  if (loading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <Loader2 size={40} color="#1D9BF0" className="animate-spin" />
      </div>
    );

  return (
    <>
      <Header
        title={`@${params.username}`}
        subtitle={`${profile?.posts.length} posts`}
      />

      <section className="w-full relative">
        <img
          src={profile?.coverImg?.secure_url ?? "/cover.png"}
          alt={`${profile?.username}'s Cover Picture`}
          className="w-full h-32 lg:h-52 object-cover"
        />
        <div className="w-full flex flex-col items-start justify-center gap-2 p-4">
          <div className="relative w-full flex justify-end items-center">
            <img
              src={profile?.img?.secure_url ?? "/default.png"}
              alt={`${profile?.username}'s Profile Picture`}
              className="rounded-full object-cover max-sm:h-28 max-sm:w-28 h-32 w-32 border-2 border-background absolute -top-[165%] sm:-top-[180%] lg:-top-[200%] left-0"
            />

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="rounded-full max-md:hidden"
                  variant="outline"
                >
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>TODO</DialogContent>
            </Dialog>

            {/* For Smaller devices */}
            <Button
              onClick={() => navigate("/settings/profile")}
              className="rounded-full md:hidden"
              variant="outline"
            >
              Edit Profile
            </Button>
          </div>

          <div className="w-full mt-5">
            <h4 className="font-semibold">{profile?.name}</h4>
            <h5 className="text-sm text-muted-foreground font-light">
              @{profile?.username}
            </h5>
          </div>

          <div className="w-full mt-2.5">
            {profile?.bio && <p className="w-full mb-2.5">{profile?.bio}</p>}
            <div className="w-full flex flex-wrap items-center gap-2.5">
              {details.map((det) => {
                if (det.value)
                  return (
                    <p
                      key={det.value}
                      className="flex items-center text-xs font-light text-muted-foreground"
                    >
                      <det.icon size={14} className="mr-1.5" />{" "}
                      <span>{det.value}</span>
                    </p>
                  );
              })}
            </div>

            <div className="w-full flex items-center gap-3.5 my-2.5">
              <p className="font-medium">
                {profile?.followings.length}{" "}
                <span className="text-muted-foreground font-light">
                  Following
                </span>
              </p>
              <p className="font-medium">
                {profile?.followers.length}{" "}
                <span className="text-muted-foreground font-light">
                  Followers
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
