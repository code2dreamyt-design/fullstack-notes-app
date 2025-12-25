import React, { useState, useEffect, useContext ,useRef} from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import Loader from "./Loader";

const CompleteProfile = () => {
  const { setIsAuth, setLoading } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const avatarFile = watch("avatar");

  useEffect(() => {
    if (avatarFile && avatarFile[0]) {
      const file = avatarFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [avatarFile]);

  const submitDetail = async (data) => {
    setLoader(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("dob", data.dob.toString());
    formData.append("avatar", data.avatar[0]);

    try {
      const res = await axios.post(
        "http://localHost:3000/profile",
        formData,
        { withCredentials: true }
      );

      setLoading(false);
      setIsAuth(true);
      navigate("/notes");
    } catch (error) {
      setLoader(false);
      console.log(error.response?.data);
      console.log(error.response?.data?.msg);
    }
  };

  return (
    <div className="relative w-full min-h-[95vh] flex justify-center items-center px-3 sm:px-4 text-white">
      {/* ===== Loader Overlay ===== */}
      {(loader || isSubmitting) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <Loader />
        </div>
      )}

      <div
        className="w-full max-w-5xl flex flex-col lg:flex-row gap-6
        shadow-[0px_2px_30px_green] rounded-2xl p-4 sm:p-6"
      >
        {/* ===== AVATAR PREVIEW ===== */}
        <div className="flex flex-col justify-center items-center lg:w-[35%]" onClick={()=>fileRef.current?.click()}>
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-white/40 flex justify-center items-center text-white/60 text-sm">
              Avatar Preview
            </div>
          )}
        </div>

        {/* ===== FORM ===== */}
        <form
          onSubmit={handleSubmit(submitDetail)}
          className="flex-1 flex flex-col gap-4"
        >
          <span className="font-bold text-lg sm:text-xl text-center">
            Complete Profile
          </span>

          <div className="w-full border-b border-white/40" />

          {/* ===== NAME ===== */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Name</label>
            <input
              type="text"
              placeholder="Name"
              className="outline-none bg-transparent border-b border-white/60 p-2"
              {...register("name", {
                required: { value: true, message: "name required" },
                maxLength: { value: 16, message: "maximum length is 16" },
                minLength: { value: 3, message: "minimum length is 3" },
              })}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* ===== DOB ===== */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Date of Birth</label>
            <input
              type="date"
              className="outline-none bg-transparent border-b border-white/60 p-2"
              {...register("dob", {
                required: { value: true, message: "age required" },
              })}
            />
            {errors.dob && (
              <span className="text-red-500 text-sm">
                {errors.dob.message}
              </span>
            )}
          </div>

          {/* ===== AVATAR ===== */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold"></label>
            <input
              type="file"
              className="outline-none border-b border-white/60 p-2 text-sm hidden"
              {...register("avatar", { required: true })} 
              ref={(el)=>{
                register("avatar").ref(el);
                fileRef.current=el
              }}
            />
            {errors.avatar && (
              <span className="text-red-500 text-sm">
                Avatar is required
              </span>
            )}
          </div>

          {/* ===== SUBMIT ===== */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-black h-12 w-full sm:w-[70%] lg:w-[45%]
              bg-[linear-gradient(159deg,rgba(14,105,29,1)_20%,rgba(69,212,47,1)_45%,rgba(26,71,5,1)_72%)]
              rounded-4xl shadow-[0px_4px_30px_black]
              cursor-pointer text-lg font-bold disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
