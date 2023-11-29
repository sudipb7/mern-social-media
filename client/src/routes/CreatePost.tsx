import CreatePostForm from "@/components/forms/CreatePostForm";
import Topbar from "@/components/shared/Topbar";

export default function CreatePost() {
  return (
    <>
      <Topbar />
      <section className="w-[90%] py-4 flex flex-col items-start justify-center mx-auto">
        <CreatePostForm />
      </section>
    </>
  );
}
