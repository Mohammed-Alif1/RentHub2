import React, { useState } from 'react';
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Login = () => {

  const { setShowLogin, axios, setToken, setIsOwner, navigate } = useAppContext();
  const [state, setState] = useState("login"); // "login" or "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onsubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const { data } = await axios.post(`/api/user/${state}`, { name, email, password });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);

        // Check if user role is 'owner'
        const isUserOwner = data.user?.role === 'owner';
        setIsOwner(isUserOwner);

        // Navigate based on role
        navigate(isUserOwner ? "/owner" : "/");
        setShowLogin(false);

        toast.success(state === "register" ? "Account created successfully!" : "Login successful!");
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-[100] flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        {/* Title */}
        <p className="text-2xl font-medium m-auto">
          <span className="text-indigo-500">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {/* Name (Register Only) */}
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
              type="text"
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            type="email"
            required
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            type="password"
            required
          />
          {state === "register" && (
            <p className="text-xs text-gray-400 mt-1">
              Must be 8+ characters with uppercase, lowercase, and a number
            </p>
          )}
        </div>

        {/* Switch Login/Register */}
        <p className="text-sm">
          {state === "register" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("login")}
                className="text-indigo-500 cursor-pointer"
              >
                Click here
              </span>
            </>
          ) : (
            <>
              Create an account?{" "}
              <span
                onClick={() => setState("register")}
                className="text-indigo-500 cursor-pointer"
              >
                Click here
              </span>
            </>
          )}
        </p>

        {/* Submit button */}
        <button
          onClick={onsubmitHandler}
          className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer"
        >
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
