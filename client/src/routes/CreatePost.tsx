import CreatePostForm from "@/components/forms/CreatePostForm";
import Topbar from "@/components/shared/Topbar";

const CreatePost: React.FC = () => {
  return (
    <>
      <Topbar />
      <section className="w-[90%] py-4 flex flex-col items-start justify-center mx-auto">
        <CreatePostForm />
      </section>
    </>
  );
};

export default CreatePost;
