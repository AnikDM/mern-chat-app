import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaUserEdit, FaKey } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ShowPassword } from "../../components/ShowPassword.jsx";
const Signup = () => {
  const [isLoading, setLoading] = useState(false);
  const {setAuthUser}=useContext(AuthContext);
  const [isShowPassword, setShowPassword] = useState("password")
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullname || !formData.username || !formData.gender)
      return toast.error("Missing Fields");

    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    if (formData.password.length < 8) {
      return toast.error("Password should be at least 8 characters long");
    }
    if (formData.username.includes(" "))
      return toast.error(
        "Username can only contain alphanumeric characters and not spaces"
      );
      
    // send data to server
    const res = await fetch("/api/auth/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(data)
    if (data.err) return toast.error(data.msg);

    setLoading(true);
    localStorage.setItem('chat-user',JSON.stringify(data));
    setAuthUser(data)
    toast.success("Signed Up Succesfully");
    setFormData({
      fullname: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "",
    });
    
  };

  return (
    <div className="p-8 rounded-xl bg-white/5 shadow-lg max-sm:w-5/6 max-lg:w-4/6 w-1/3 backdrop-blur-md select-none">
      <div className="flex items-center w-full">
        <h2 className="text-white text-3xl font-bold my-3 w-full">Sign Up</h2>
        <FaMessage size={36} className="float-end" />
      </div>
      <form className="form-control w-full" onSubmit={handleSubmit}>
        <label
          htmlFor=""
          className="input input-bordered w-full my-2 flex items-center"
        >
          <FaUser />
          <input
            type="text"
            placeholder="Full Name"
            className={`mx-2 ${isLoading ? " cursor-not-allowed" : ""}`}
            disabled={isLoading}
            onChange={(e) =>
              setFormData((input) => ({ ...input, fullname: e.target.value }))
            }
          />
        </label>
        <label
          htmlFor=""
          className="input input-bordered w-full my-2 flex items-center"
        >
          <FaUserEdit size={20} />
          <input
            type="text"
            placeholder="Username"
            className={`mx-2 ${isLoading ? " cursor-not-allowed" : ""}`}
            disabled={isLoading}
            onChange={(e) =>
              setFormData((input) => ({
                ...input,
                username: e.target.value.toLowerCase(),
              }))
            }
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
            className={`mx-2 ${isLoading ? " cursor-not-allowed" : ""} grow`}
            disabled={isLoading}
            onChange={(e) =>
              setFormData((input) => ({ ...input, password: e.target.value }))
            }
          />
          <ShowPassword setShowPassword={setShowPassword}/>
        </label>
        <label
          htmlFor=""
          className="input input-bordered w-full my-2 flex items-center"
        >
          <FaKey />?
          <input
            type={isShowPassword}
            placeholder="Confirm Password"
            className={`mx-2 ${isLoading ? " cursor-not-allowed" : ""}`}
            disabled={isLoading}
            onChange={(e) =>
              setFormData((input) => ({
                ...input,
                confirmPassword: e.target.value,
              }))
            }
          />
        </label>
        <div className="flex justify-center my-4">
          <div className="flex-1 flex items-center justify-center">
            <input
              type="checkbox"
              className={`mx-1 checkbox checkbox-primary ${
                isLoading ? " cursor-not-allowed" : ""
              }`}
              name="checkbox-2"
              disabled={isLoading}
              id="male"
              checked={formData.gender === "male"}
              onChange={() =>
                setFormData((input) => ({ ...input, gender: "male" }))
              }
            />
            <span>Male</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <input
              type="checkbox"
              className={`mx-1 checkbox checkbox-primary ${
                isLoading ? " cursor-not-allowed" : ""
              }`}
              name="checkbox-2"
              disabled={isLoading}
              onChange={() =>
                setFormData((input) => ({ ...input, gender: "female" }))
              }
              checked={formData.gender === "female"}
              id="female"
            />
            Female
          </div>
        </div>
        <div className="label-text-alt">
          Already an User?
          <Link to={"/"} className="text-primary">
            {" "}
            Log In
          </Link>
        </div>
        <button
          className="btn btn-primary mt-4 w-full font-bold text-xl"
          type="submit"
          disabled={isLoading}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Signup;
