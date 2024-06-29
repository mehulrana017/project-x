import React from "react";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { AlertContext } from "../context/AlertContext";
import { useUser } from "../hooks/Hooks";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the schema using Zod
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Register() {
  const { dispatchUser } = useContext(UserContext);
  const { dispatchAlert } = useContext(AlertContext);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      window.location.href = "/profile";
    }
  }, [user]);

  const methods = useForm({
    resolver: zodResolver(registerSchema),
  });

  const { control, handleSubmit, formState: { errors } } = methods;

  const onSubmit = async (userDetails) => {
    try {
      dispatchUser({ type: "LOADING" });
      const res = await fetch("http://localhost:3000/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...userDetails, name: userDetails?.username}),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setTimeout(() => {
        dispatchUser({ type: "LOG_IN", payload: result.user });
        dispatchAlert({
          type: "SHOW",
          payload: result.message,
          variant: "Success",
        });
        window.location.href = "/profile";
      }, 3000);
    } catch (err) {
      dispatchAlert({
        type: "SHOW",
        payload: err.message,
        variant: "Warning",
      });
      dispatchUser({ type: "ERROR" });
    }
  };

  return (
    <div className="flex justify-center">
      <div className="mt-20">
        <h1 className="font-bold text-3xl mb-5">Register</h1>
        <p className="mb-8">Let's get you started</p>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-[27px] mt-[8px]">
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem className="text-darkblue font-medium text-[12px]">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-primary-0 rounded transition duration-300 focus-within hover:border-1 hover:border-solid h-[23px] hover:border-primary-500 hover:bg-primary-0 hover:shadow-custom"
                      placeholder="Username"
                      {...field}
                    />
                  </FormControl>
                  {errors.username && <FormMessage>{errors.username.message}</FormMessage>}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="text-darkblue font-medium text-[12px]">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-primary-0 rounded transition duration-300 focus-within hover:border-1 hover:border-solid h-[23px] hover:border-primary-500 hover:bg-primary-0 hover:shadow-custom"
                      placeholder="Email address"
                      {...field}
                    />
                  </FormControl>
                  {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem className="text-darkblue font-medium text-[12px]">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-primary-0 rounded transition duration-300 focus-within hover:border-1 hover:border-solid h-[23px] hover:border-primary-500 hover:bg-primary-0 hover:shadow-custom"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
                </FormItem>
              )}
            />
            <Button
              className="h-[40px] w-full mt-2 bg-purple-700 text-white font-medium text-lg py-2 px-5 rounded-3xl"
              type="submit"
            >
              Register
            </Button>
          </form>
        </Form>
        <p className="mt-5">Or <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default Register;
