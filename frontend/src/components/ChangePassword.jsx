import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import api from "../api/api";
const ChangePassword = () => {
  const [eye, setEye] = useState("fa-eye");
  const [type, setType] = useState("password");
  const [eye2, setEye2] = useState("fa-eye");
  const [type2, setType2] = useState("password");
  const [status, setStatus] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    getValues,
    formState: { errors: errorsPass, isSubmitting: isSubmittingPass },
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


const changePassword = async (data) => {
  try {
    const response = await api.post("/reset/resetpass", data);

    setMsg(response.data.msg);
    setStatus(true);
  } catch (error) {
    const message =
      error.response?.data?.msg ||
      "Password reset failed. Please try again.";

    console.error("Change password error:", message);
    setMsg(message);
    setStatus(false);
  }
};


  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 sm:px-6">
      {/* ===== Loader Overlay ===== */}
      {isSubmittingPass && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 rounded-2xl">
          <Loader />
        </div>
      )}

      <div className="w-full flex flex-col items-center py-6">
        <div className="w-full h-px bg-amber-100 mb-3" />

        <p className="text-xl sm:text-2xl text-amber-100 text-center mb-3">
          Create New Password
        </p>

        <div className="w-full h-px bg-amber-100 mb-4" />

        {/* ===== FORM ===== */}
        <form
          className={`w-full sm:w-[85%] md:w-[75%] ${
            status ? "hidden" : "block"
          }`}
          onSubmit={handleSubmitPass(changePassword)}
        >
          {/* ===== NEW PASSWORD ===== */}
          {errorsPass.newPassword && (
            <p className="text-red-600 text-sm mb-1">
              {errorsPass.newPassword.message}
            </p>
          )}

          <div className="w-full h-12 border border-[#ffffff74] rounded-2xl p-1 bg-[#01201668] relative flex items-center">
            <i className="fa-solid fa-lock text-[#ffffff9b] ml-2"></i>

            <input
              type={type}
              className="outline-none w-full h-full px-2 bg-transparent"
              placeholder="Enter new password"
              {...registerPass("newPassword", {
                required: { value: true, message: "Enter new password" },
                maxLength: { value: 20 },
              })}
            />

            <i
              className={`fa-solid ${eye} text-[#ffffff9b] absolute right-3 cursor-pointer`}
              onClick={eyeAnDlock}
            ></i>
          </div>

          {/* ===== CONFIRM PASSWORD ===== */}
          {errorsPass.confirmNewPassword && (
            <p className="text-red-600 text-sm mt-2">
              {errorsPass.confirmNewPassword.message}
            </p>
          )}

          <div className="w-full h-12 border border-[#ffffff74] rounded-2xl mt-3 p-1 bg-[#01201668] relative flex items-center">
            <i className="fa-solid fa-lock text-[#ffffff9b] ml-2"></i>

            <input
              type={type2}
              className="outline-none w-full h-full px-2 bg-transparent"
              placeholder="Confirm new password"
              {...registerPass("confirmNewPassword", {
                required: { value: true, message: "Enter password again" },
                maxLength: { value: 20 },
                validate: (value) => {
                  const password = getValues("newPassword");
                  return value === password || "Password does not match";
                },
              })}
            />

            <i
              className={`fa-solid ${eye2} text-[#ffffff9b] absolute right-3 cursor-pointer`}
              onClick={eyeAnDlock2}
            ></i>
          </div>

          {/* ===== SUBMIT ===== */}
          <div className="w-full flex justify-center mt-5">
            <input
              type="submit"
              disabled={isSubmittingPass}
              value="Change Password"
              className="text-black h-12 w-full sm:w-[70%] md:w-[60%]
              bg-[linear-gradient(159deg,rgba(14,105,29,1)_20%,rgba(69,212,47,1)_45%,rgba(26,71,5,1)_72%)]
              rounded-4xl shadow-[0px_4px_30px_black]
              cursor-pointer disabled:opacity-50"
            />
          </div>
        </form>

        {/* ===== SUCCESS STATE ===== */}
        <div
          className={`w-full sm:w-[80%] flex-col items-center gap-4 mt-6 ${
            status ? "flex" : "hidden"
          }`}
        >
          <p className="text-xl sm:text-2xl text-amber-100 text-center">
            {msg}
          </p>

          <button
            className="text-black h-12 w-full sm:w-[70%] md:w-[60%]
            bg-[linear-gradient(159deg,rgba(14,105,29,1)_20%,rgba(69,212,47,1)_45%,rgba(26,71,5,1)_72%)]
            rounded-4xl shadow-[0px_4px_30px_black] cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
