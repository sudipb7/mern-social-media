import Topbar from "@/components/shared/Topbar";
import FloatingButton from "@/components/FloatingButton";
import Header from "@/components/shared/Header";
import Feed from "@/components/forms/Feed";

const Home: React.FC = () => {
  return (
    <>
      <Topbar />
      <Header title="Home" isHide={true} />
      <Feed api="/post" />
      <FloatingButton />
    </>
  );
};

export default Home;
