import { useState } from "react";
import { FaUserEdit, FaKey } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { Link } from "react-router-dom";

import { ShowPassword } from "../../components/ShowPassword";
import { useAuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
const Login = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const {setAuthUser} = useAuthContext();
  const [isLoading, setLoading] = useState(false);
  const [isShowPassword, setShowPassword] = useState("password");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(user))
    try {
      const res = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (!data.error) {
        setLoading(true);
        console.log("Response", data);
        console.log("Actual Response", res);
        localStorage.setItem("chat-user", JSON.stringify(data));
        setAuthUser(data);
        toast.success("Logged in successfully")
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };
  return (
    <div className="p-8 rounded-xl bg-white/5 shadow-lg max-sm:w-5/6 max-lg:w-4/6 w-1/3 backdrop-blur-md">
      <div className="flex items-center w-full">
        <h2 className="text-white text-3xl font-bold my-3 w-full">Log In</h2>
        <FaMessage size={36} className="float-end" />
      </div>
      <form className="form-control w-full" onSubmit={handleSubmit}>
        <label
          htmlFor=""
          className="input input-bordered w-full my-2 flex items-center"
        >
          <FaUserEdit size={20} />
          <input
            type="text"
            placeholder="Username"
            className="mx-2"
            onChange={(e) => {
              setUser((item) => ({ ...item, username: e.target.value }));
            }}
            disabled={isLoading}
          />
        </label>
        <label
          htmlFor=""
          className="input input-bordered w-full my-2 flex items-center"
        >
          <FaKey />
          <input
            type={isShowPassword}
            placeholder="Password"
            className="mx-2 grow"
            onChange={(e) => {
              setUser((item) => ({ ...item, password: e.target.value }));
            }}
            disabled={isLoading}
          />
          <ShowPassword setShowPassword={setShowPassword} />
        </label>

        <div className="label-text-alt">
          New User?
          <Link to={"/signup"} className="text-primary">
            {" "}
            Sign Up
          </Link>
        </div>
        <button
          className="btn btn-primary mt-4 w-full font-bold text-xl"
          type="submit"
          disabled={isLoading}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
