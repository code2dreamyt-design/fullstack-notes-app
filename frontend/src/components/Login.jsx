import { Link, useNavigate } from 'react-router-dom';
import glogo from '/images/google logo.png';
import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import Loader from "./Loader";
import api from '../api/api';

const Login = () => {
  const navigate = useNavigate();
  const { setIsAuth } = useContext(AuthContext);

  const [eye, setEye] = useState("fa-eye");
  const [type, setType] = useState("password");
  const [loading, setloading] = useState(false);
  const [msg, setMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const handleLogin = async (data) => {
    setloading(true);
    try {
      const response = await api.post("/login", data);
      const res = response.data;
      setMsg(res.msg);
      setIsAuth(true);
      navigate("/notes");
    } catch (error) {
      if (error.response?.data?.reason === "EMAIL_NOT_VERIFIED") {
        navigate("/emailverify");
      }
      if (error.response?.data?.reason === "PROFILE_INCOMPLETE") {
        navigate("/completeprofile");
      }
      
      setMsg(error.response?.data?.msg);
        setloading(false);
      setTimeout(() => setMsg(""), 4000);
    }
  };

  const eyeAnDlock = () => {
    if (eye === "fa-eye" && type === "password") {
      setEye("fa-eye-slash");
      setType("text");
    } else {
      setEye("fa-eye");
      setType("password");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4 text-white">
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="
            w-full max-w-md sm:max-w-lg md:max-w-xl
            flex flex-col gap-6 p-5
            md:shadow-[0px_4px_30px_black] md:rounded-2xl
          "
        >
          {/* HEADER */}
          <div>
            <p className="text-2xl sm:text-3xl font-bold">Welcome Back</p>
            <p className="text-[#ffffff9b]">
              Login to view daily updates
            </p>
            {msg && (
              <p className="text-red-600 text-sm font-bold text-center mt-2">
                *{msg}!
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <p className="ml-2 mb-1">
              Email: {errors.email && (
                <span className="text-red-600 text-sm">
                  {errors.email.message}
                </span>
              )}
            </p>
            <div className="flex items-center gap-2 h-12 border border-[#ffffff74] rounded-2xl px-3 bg-[#01201668]">
              <i className="fa-solid fa-envelope text-[#ffffff9b]" />
              <input
                type="email"
                className="flex-1 outline-none bg-transparent"
                placeholder="Enter your email"
                {...register("email", {
                  required: { value: true, message: "email is required" },
                  minLength: { value: 8, message: "min email length is 8" },
                  maxLength: { value: 50, message: "max email length is 20" }
                })}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <p className="ml-2 mb-1">
              Password: {errors.password && (
                <span className="text-red-600 text-sm">
                  {errors.password.message}
                </span>
              )}
            </p>
            <div className="relative flex items-center gap-2 h-12 border border-[#ffffff74] rounded-2xl px-3 bg-[#01201668]">
              <i className="fa-solid fa-lock text-[#ffffff9b]" />
              <input
                type={type}
                className="flex-1 outline-none bg-transparent"
                placeholder="Enter Your Password"
                {...register("password", {
                  required: { value: true, message: "Password is required" },
                  minLength: { value: 8, message: "min password length is 8" },
                  maxLength: { value: 20, message: "max password length is 20" }
                })}
              />
              <i
                className={`fa-solid ${eye} text-[#ffffff9b] cursor-pointer`}
                onClick={eyeAnDlock}
              />
            </div>

            {/* OPTIONS */}
            <div className="flex justify-between items-center mt-2 text-[#ffffff74] text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                Remember me
              </label>
              <Link to="/forgetPass">Forget Password?</Link>
            </div>
          </div>

          {/* SUBMIT */}
          <input
            type="submit"
            disabled={isSubmitting}
            value="Login"
            className="
              text-black h-12 w-full
              bg-[linear-gradient(159deg,rgba(14,105,29,1)_20%,rgba(69,212,47,1)_45%,rgba(26,71,5,1)_72%)]
              rounded-4xl shadow-[0px_4px_30px_black] cursor-pointer
            "
          />

          {/* DIVIDER */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-[1px] bg-[#ffffff74]" />
            <span className="text-[#ffffff74]">Or</span>
            <div className="flex-1 h-[1px] bg-[#ffffff74]" />
          </div>

          {/* SOCIAL */}
          <div className="flex gap-3">
            <button className="flex-1 h-12 border border-[#ffffff74] rounded-2xl flex items-center justify-center gap-2">
              <img src={glogo} className="w-8 h-8" />
              Google
            </button>
            <button className="flex-1 h-12 border border-[#ffffff74] rounded-2xl flex items-center justify-center gap-2">
              <i className="fa-brands fa-apple text-xl" />
              Apple
            </button>
          </div>

          {/* FOOTER */}
          <div className="flex justify-center text-sm">
            <span className="text-[#ffffff74] mr-1">
              Don't have an account?
            </span>
            <Link to="/register" className="text-white">
              Create an account
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
