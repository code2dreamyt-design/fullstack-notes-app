import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mail from '/images/mail.png';
import api from '../api/api';
import Loader from './Loader';

const EmailVerification = () => {
  const navigate = useNavigate();
  const [verifiedbtn, setVerifiedbtn] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [resend, setResend] = useState(false);
  const [loading, setloading] = useState(false);
  const [msg, setMsg] = useState('');

  const Phases = [60, 120, 240, 600, 43200, 86400];

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) return `${hrs}h ${mins.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
    if (mins > 0) return `${mins}m ${secs.toString().padStart(2, "0")}s`;
    return `${secs}s`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft === 0) {
        clearInterval(interval);
        setResend(true);
        setPhaseIndex(prev => prev + 1);
      } else {
        setTimeLeft(prev => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    setTimeout(() => {
      if (msg !== '') setMsg('');
      if (!verifiedbtn) setVerifiedbtn(true);
    }, 4000);
  }, [verifiedbtn, msg]);

  const verificationStatus = async () => {
    setloading(true);
    try {
      await api.get("/verifyemail/auth/emailstatus");
      navigate("/completeprofile");
    } catch (error) {
      setloading(false);
      setMsg(error.response?.data?.msg);
    }
  };

  const resendEmail = async () => {
    setloading(true);
    try {
      const response = await api.get("/verifyemail/auth/resend");
      setMsg(response.data.msg);
    } catch (error) {
      setloading(false);
      setMsg(error.response?.data?.msg);
    }
  };

  return (
    <div className="w-full min-h-[85vh] px-4 flex justify-center items-center">
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <Loader />
        </div>
      ) : (
        <div className="w-full max-w-3xl flex flex-col items-center gap-6">

          {/* IMAGE */}
          <div className="w-full flex justify-center">
            <img
              src={mail}
              alt="mail"
              className="w-full max-w-sm sm:max-w-md md:max-w-lg object-contain"
            />
          </div>

          {/* TEXT */}
          <div className="text-center space-y-2 px-2">
            <p className="font-bold text-lg sm:text-xl md:text-2xl">
              Email has been sent
            </p>
            <p className="text-sm sm:text-base text-[#ffffffb6]">
              Please check your inbox and click the verification link
            </p>
            {msg && (
              <p className="text-red-600 text-sm">
                {msg}
              </p>
            )}
          </div>

          {/* VERIFY BUTTON */}
          <button
            disabled={!verifiedbtn}
            className={`w-full max-w-xs h-12 text-base font-semibold rounded-4xl
              ${verifiedbtn ? "opacity-100" : "opacity-50"}
              bg-[linear-gradient(264deg,rgba(131,58,180,1)_0%,rgba(253,29,29,1)_63%,rgba(252,176,69,1)_92%)]
            `}
            onClick={() => {
              verificationStatus();
              setVerifiedbtn(false);
            }}
          >
            Verify
          </button>

          {/* RESEND */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-[#ffffffb6]">
              Didn't receive link?
            </p>
            <button
              disabled={!resend}
              className={`font-bold text-orange-500
                ${resend ? "opacity-100" : "opacity-50"}
              `}
              onClick={() => {
                resendEmail();
                setResend(false);
                setTimeLeft(Phases[phaseIndex]);
              }}
            >
              <i className="fa-solid fa-rotate-left mr-1"></i>
              Resend
            </button>
          </div>

          {/* TIMER */}
          {timeLeft !== 0 && (
            <span className="text-sm sm:text-base">
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
