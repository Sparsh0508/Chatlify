import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaLock } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handelInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };
  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const login = await axios.post(`/api/auth/login`, userInput);
      const data = login.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 border border-gray-100">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Login
          <span className="text-blue-500"> Chatlify</span>
        </h1>

        <form onSubmit={handelSubmit} className="flex flex-col gap-4 mt-4">
          <div>
            <label className="label p-2">
              <span className="text-base label-text text-gray-300">Email</span>
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <FaUser className="text-gray-500" />
              <input
                id="email"
                type="email"
                onChange={handelInput}
                placeholder="Enter your email"
                required
                className="grow"
              />
            </label>
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text text-gray-300">Password</span>
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <FaLock className="text-gray-500" />
              <input
                id="password"
                type="password"
                onChange={handelInput}
                placeholder="Enter your password"
                required
                className="grow"
              />
            </label>
          </div>

          <Link
            to="/register"
            className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block text-gray-300"
          >
            {"Don't"} have an account?
          </Link>

          <div>
            <button className="btn btn-block btn-primary btn-sm mt-2" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
