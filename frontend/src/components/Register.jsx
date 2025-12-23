import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import glogo from "/public/images/google logo.png";
import { useForm } from "react-hook-form";
import Loader from "./Loader";
import axios from "axios";
const Register = () => {
  const [eye, setEye] = useState("fa-eye");
  const [type, setType] = useState("password");
  const [eye2, setEye2] = useState("fa-eye");
  const [type2, setType2] = useState("password");
  const [loading,setloading] = useState(false);
  const [msg,setMsg] = useState('');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm();

  const eyeAnDlock = () => {
    if (eye === "fa-eye" && type === "password") {
      setEye("fa-eye-slash");
      setType("text");
    } else {
      setEye("fa-eye");
      setType("password");
    }
  };

  const eyeAnDlock2 = () => {
    if (eye2 === "fa-eye" && type2 === "password") {
      setEye2("fa-eye-slash");
      setType2("text");
    } else {
      setEye2("fa-eye");
      setType2("password");
    }
  };

  const handleReg = async (data) => {
    setloading(true);
    console.log(data);
    try {
      const response = await axios.post("http://localhost:3000/register",data,{withCredentials:true});
      const res = response.data;
      console.log(res);
      navigate("/emailverify");
    } catch (error) {
      console.log(error?.response?.data);
      setMsg(error.response?.data?.msg);
      setTimeout(()=>{
        setMsg("");
      },5000)
      setloading(false);
    }
  };

  return (
    <div className="text-white w-full md:w-[80%] lg:w-[70%] h-screen lg:h-[80%] flex flex-col justify-between p-2 lg:absolute lg:top-10 ">
     {
      loading ? <Loader/> :(
         <form
        action=""
        onSubmit={handleSubmit(handleReg)}
        className="h-[90%] md:w-[70%] md:m-auto lg:w-[40%] lg:m-auto flex flex-col justify-around pt-5 pb-5 pr-2 pl-2 mt-10 md:shadow-[0px_4px_30px_black] md:rounded-2xl"
      >
        <div className="p-2">
          <p className="text-3xl font-bold mb-1">Create Account</p>
          <p className="text-[#ffffff9b]">Create your account daily updates</p>

           { msg && <p className="text-center text-red-600 text-sm font-bold">
              *{msg}!
            </p>}
        </div>  
        <div className="w-full p-2">
          {isSubmitting && <div className="text-blue-700">Loading...</div>}
          <p className="ml-2 mb-2">
            Email:{" "}
            {errors.email && (
              <span className="text-red-600 text-sm">
                {errors.email.message}
              </span>
            )}
          </p>
          <div className="w-full h-12 border-[1px] border-[#ffffff74] bg-[#01201668] rounded-2xl mt-1 p-1">
            <i className="fa-solid fa-envelope text-[#ffffff9b] ml-1"></i>

            <input
              type="email"
              className="outline-none w-[90%] h-full p-2"
              placeholder="Enter your Email"
              {...register("email", {
                required: { value: true, message: "email is required" },
                minLength: { value: 8, message: "min email lenght is 8" },
                maxLength: { value: 45, message: "max email lenght is 20" },
              })}
            />
          </div>
        </div>
        <div className="w-full p-2">
          <p className="ml-2 mb-2">
            Password:{" "}
            {errors.password && (
              <span className="text-red-600 text-sm">
                {errors.password.message}
              </span>
            )}
          </p>
          <div className="w-full h-12 bg-[#01201668] border-[1px] rounded-2xl border-[#ffffff74] mt-1 relative">
            <i className="fa-solid fa-lock text-[#ffffff9b] ml-1"></i>
            <input
              type={type}
              className="outline-none w-[80%] h-full p-2"
              placeholder="Enter Your Password"
              {...register("password", {
                required: { value: true, message: "Password is required" },
                minLength: { value: 8, message: "min password lenght is 8" },
                maxLength: { value: 20, message: "max password lenght is 20" },
              })}
            />
            <i
              className={`fa-solid ${eye} text-[#ffffff9b] absolute right-2 top-[33%]`}
              onClick={() => eyeAnDlock()}
            ></i>
          </div>
        </div>
        <div className="w-full p-2 mb-2 ">
          <p className="ml-2 mb-2">
            Confirm Password:{" "}
            {errors.confirmPassword && (
              <span className="text-red-600 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </p>
          <div className="w-full h-12 bg-[#01201668] border-[1px] rounded-2xl border-[#ffffff74] mt-1 relative">
            <i className="fa-solid fa-lock text-[#ffffff9b] ml-1"></i>
            <input
              type={type2}
              className="outline-none w-[80%] h-full p-2"
              placeholder="Enter Your Password"
              {...register("confirmPassword", {
                required: { value: true, message: "Password is required" },
                minLength: { value: 8, message: "min password lenght is 8" },
                maxLength: { value: 20, message: "max password lenght is 20" },
                validate: (value) => {
                  const password = getValues("password");
                  return value === password || "Password does not matched";
                },
              })}
            />
            <i
              className={`fa-solid ${eye2} text-[#ffffff9b] absolute right-2 top-[33%]`}
              onClick={() => eyeAnDlock2()}
            ></i>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-center text-black h-12 w-[95%] bg-[linear-gradient(159deg,rgba(14,105,29,1)_20%,rgba(69,212,47,1)_45%,rgba(26,71,5,1)_72%)] rounded-4xl shadow-[0px_4px_30px_black] mb-1 cursor-pointer"
          >
            Create Account
          </button>

          <div className="w-full flex justify-between items-center p-2 mt-1">
            <div className="w-full h-[1px] bg-[#ffffff74]"></div>

            <div className="pr-2 pl-2 text-[#ffffff74]">Or</div>
            <div className="w-full h-[1px] bg-[#ffffff74]"></div>
          </div>
        </div>

        <div className="w-full flex justify-between items-center pr-2 pl-2">
          <button className="w-[48%] h-12 border-[1px] border-[#ffffff74] rounded-2xl  flex justify-center items-center bg-[#01201668] ">
            <img src={glogo} alt="" className="w-9 h-9" />
            Google
          </button>
          <button className="w-[48%] h-12 border-[1px] border-[#ffffff74] rounded-2xl flex justify-center items-center bg-[#01201668] ">
            <i className="fa-brands fa-apple text-xl mr-2"></i>Apple
          </button>
        </div>
        <div className="flex justify-center mt-5">
          <span className="text-[#ffffff74] text-sm mr-1">
            Already have an account?
          </span>
          <span className="text-white text-sm cursor-pointer">
            <Link to="/login">Login</Link>
          </span>
        </div>
      </form>
      )
     }
    </div>
  );
};

export default Register;
