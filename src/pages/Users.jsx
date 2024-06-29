import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../hooks/Hooks";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AddDialog from "@/components/AddDialog";

function Products() {
  const addDialogRef = useRef();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const { user, dispatchUser } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      dispatchUser({ type: "LOADING" });
      try {
        const res = await fetch("http://localhost:3000/api/v1/products");

        const result = await res.json();

        if (res.ok) {
          setProducts(result.data);
        } else {
          throw new Error();
        }
      } catch (error) {
        setError(true);
        console.log(error);
      } finally {
        // setLoading(false)
        dispatchUser({ type: "ERROR" });
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <AddDialog ref={addDialogRef} />

      <div className="space-y-3 grid mt-20 px-10 max-w-2xl mx-auto">
        <Button onClick={()=>addDialogRef.current.open()}>Add Furniture</Button>
        {/* {products?.map((user) => {
        return (
          <Link
            to={`/users/${user.username}`}
            key={user._id}
            className="flex flex-col gap-2"
          >
            <h3 className="font-semibold text-lg">{user.username}</h3>
            <p>{user.email}</p>
          </Link>
        );
      })}
      {error && "Something went wrong"} */}
      </div>
    </>
  );
}

export default Products;
