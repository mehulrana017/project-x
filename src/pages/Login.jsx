import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { AlertContext } from "../context/AlertContext";
import { useUser } from "../hooks/Hooks";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the schema using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Login() {
  const { dispatchUser } = useContext(UserContext);
  const { dispatchAlert } = useContext(AlertContext);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      window.location.href = "/profile";
    }
  }, [user]);

  const methods = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { control, handleSubmit, formState: { errors } } = methods;

  const onSubmit = async (userDetails) => {
    try {
      dispatchUser({ type: "LOADING" });
      const res = await fetch("http://localhost:3000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      // Save the token in local storage or cookie
      localStorage.setItem("token", result.token);

      setTimeout(() => {
        dispatchAlert({
          type: "SHOW",
          payload: "Log in successful",
          variant: "Success",
        });

        dispatchUser({ type: "LOG_IN", payload: result.user });
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
        <h1 className="font-bold text-3xl mb-5">Log in</h1>
        <p className="mb-8">Enter your details below to log in</p>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-[27px] mt-[8px]">
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
                      placeholder="Minimum 8 characters"
                      maxLength={16}
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
              Log in
            </Button>
          </form>
        </Form>
        <p className="mt-5">
          Or <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
