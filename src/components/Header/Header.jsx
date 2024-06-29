import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
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
        {/* {user && (
          <button
            onClick={handleLogout}
            className=" right-10 bg-red-700 text-white font-medium text-lg px-5 h-10 w-28 rounded-3xl"
            type="submit"
          >
            Log out
          </button>
        )} */}
      </div>
    </nav>
  );
};

export default Header;
