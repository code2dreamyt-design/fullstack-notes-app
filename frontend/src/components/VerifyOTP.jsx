import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import api from '../api/api';
const VerifyOTP = () => {
  const [resend,setResend] = useState(false);
  const [loader,setLoader] = useState(false);
  const [timeLeft,setTimeLeft] = useState(0);

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) return `${hrs}h ${mins.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
    if (mins > 0) return `${mins}m ${secs.toString().padStart(2, "0")}s`;
    return `${secs}s`;
  }

  useEffect(()=>{
    const interval = setInterval(()=>{
      if(timeLeft===0){
        clearInterval(interval);
        setResend(true);
      }else{
        setTimeLeft(pre => pre-1);
      }
    },1000);
    return ()=>clearInterval(interval)
  },[timeLeft]);

 

  const getTimer = async ()=>{
    try {
      const response = await api.get('/reset/getTimer');
    setTimeLeft(0);
    } catch (error) {

      console.log(error.response.status);
      if(error.response.status===429){
        setTimeLeft(error.response.data.timeLeft);
      }
    }
  }
  useEffect(()=>{
    getTimer();
  },[])
  

  const {
    register: registerOTP,
    handleSubmit: handleSubmitOTP,
    formState: { errors: errorsOTP, isSubmitting: isSubmittingOTP }
  } = useForm();

  const navigate = useNavigate();

  const verifyOTP = async (data) => {
    setLoader(true);
    try {
      const response = await api.post( '/reset/verifyotp',data,{
      withCredentials:true 
      });

      console.log(response)
      navigate('/changePass')
    } catch (error) {
      setLoader(false)
      console.log(error.response.status);
      console.log(error.response.data.msg);
    }
  }
  const resendOtp = async ()=>{
    setLoader(true);
    try {
      const response = await api.get("/reset/resendotp",{withCredentials:true});
      console.log(response.data);
      ;
      getTimer();
      setLoader(false);
      setResend(false)
    } catch (error) {
      setLoader(false)
      console.log(error.response.status);
      console.log(error.response.data.msg)
    }
  }
  return (
    <div className="w-full md:w-[80%] lg:w-[60%] m-auto">
     {
      loader ? <Loader/> : (
         <div className="w-full flex flex-col items-center justify-center p-2">

        <div className="w-full h-[1px] bg-amber-100 mb-3" />

        <p className="text-xl md:text-2xl text-amber-100 text-center mb-3">
          OTP has been sent to your registered email.
        </p>

        <div className="w-full h-[1px] bg-amber-100 mb-4" />

        <form
          className="w-[85%] md:w-[70%]"
          onSubmit={handleSubmitOTP(verifyOTP)}
        >
          {errorsOTP.otp && (
            <p className="text-red-600 text-sm mb-1">
              {errorsOTP.otp.message}
            </p>
          )}

          <div className="w-full h-12 border border-[#ffffff74] rounded-2xl bg-[#01201668] px-3">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter 6-digit OTP"
              className="outline-none w-full h-full bg-transparent"
              {...registerOTP('otp', {
                required: 'Enter OTP first',
                minLength: {
                  value: 6,
                  message: 'OTP must be 6 digits'
                },
                maxLength: {
                  value: 6,
                  message: 'OTP must be 6 digits'
                },
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: 'OTP must contain only numbers'
                }
              })}
            />
          </div>

          <div className="w-full flex justify-center mt-4">
            <button
              type="submit"
              disabled={isSubmittingOTP}
              className={`h-12 w-[65%] rounded-4xl font-semibold
                ${
                  isSubmittingOTP
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer'
                }
                bg-[linear-gradient(159deg,rgba(14,105,29,1)_20%,rgba(69,212,47,1)_45%,rgba(26,71,5,1)_72%)]
                shadow-[0px_4px_30px_black]
              `}
            >
              {isSubmittingOTP ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
        <div>
          <button
          disabled={!resend}
              className={`font-bold text-orange-500 mt-4
                ${resend ? "opacity-100" : "opacity-50"}
              `}   
              onClick={()=>{
                resendOtp();
              }}
            >
              <i className="fa-solid fa-rotate-left mr-1"></i>
              Resend
            </button>
            <p className='text-center'>
              {formatTime(timeLeft)}
            </p>
        </div>
      </div>
      )
     }
    </div>
  );
};

export default VerifyOTP;
