import { Feather } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FloatingButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/create")}
      className="rounded-full p-4 sm:hidden bg-[#1A8CD8] hover:bg-[#1A8CD8] fixed bottom-20 right-4"
    >
      <Feather color="white" />
    </button>
  );
};

export default FloatingButton;
