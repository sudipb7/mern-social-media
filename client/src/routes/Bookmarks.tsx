import Header from "@/components/shared/Header";
import Feed from "@/components/cards/Feed";
import FloatingButton from "@/components/FloatingButton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Bookmarks: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth?.user);

  return (
    <>
      <Header title="Bookmarks" subtitle={`@${user?.username}`} isHide={false} />
      <Feed api={`/post/bookmark/${user?._id}`} />
      <FloatingButton />
    </>
  );
};

export default Bookmarks;
