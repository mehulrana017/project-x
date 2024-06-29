import { useUser } from "@/hooks/Hooks";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { UserContext } from "@/context/UserContext";
import { AlertContext } from "@/context/AlertContext";

const Header = () => {
  const { user } = useUser();
  const { toast } = useToast()
  const { dispatchUser } = useContext(UserContext);
  const { dispatchAlert } = useContext(AlertContext);

  const handleLogout = async()=>{

    const res = await fetch('http://localhost:3000/api/v1/users/logout')
    if(res) {
      dispatchUser({ type: "LOG_OUT" });
      toast({
        title: "Status",
        description: "Logged Out",
      })
    }
  }

  return (
    <nav
      style={{ borderBottom: "1px solid #BA9DF8" }}
      className="bg-[#FFFBFE] flex justify-between h-[70px]"
    >
      <div className="flex items-center pl-[16px]">
        <div className=" cursor-pointer" onClick={() => {}}>
          <Link to="/" className="text-xl font-semibold">
            PROJECT-X
          </Link>
        </div>
      </div>
      <div className="flex items-center pr-[16px]">
        <Link
          to="/users"
          className=" right-10 grid place-content-center bg-blue-700 text-white font-medium text-lg px-5 h-10 w-28 rounded-3xl"
        >
          Admin
        </Link>
        {user && (
          <button
            onClick={handleLogout}
            className=" right-10 bg-red-700 text-white font-medium text-lg px-5 h-10 w-28 rounded-3xl"
            type="submit"
          >
            Log out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
