import Topbar from "@/components/shared/Topbar";
import FloatingButton from "@/components/FloatingButton";
import Header from "@/components/shared/Header";

export default function Home() {
  return (
    <>
      <Topbar />
      <div className="max-sm:hidden w-full">
        <Header title="Home" />
      </div>
      <FloatingButton />
    </>
  );
}
