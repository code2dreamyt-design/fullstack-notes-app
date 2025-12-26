import React, { useState,useRef } from 'react';
import toplogo from '/images/profile.png';
import Loader from "./Loader"
import api from '../api/api';
const Profile = ({ setProfile, user ,getProfile }) => {
  const [emailInput,setEmailInput] = useState(user.email);
  const [otpInput,setOtpInput] = useState(false)
  const [editMode,setEditMode] = useState(false);
  const [otp,setOtp] = useState("");
  const [loader,setLoader] = useState(false);
  const fileRef = useRef(null);

  //time formater
  function formatToMonthYear(isoString) {
    const date = new Date(isoString);
    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${year}`;
  }
    //photo previewer
  const handleAvatarChange = async (e)=>{
      const file = e.target.files[0];
      if(!file) return;
      setLoader(true);
      const formdata = new FormData();
      formdata.append("avatar",file);
      formdata.append("publicId",user.avatar.publicId)
      try {
        const result = await api.post("/updateProfile/avatar",formdata,{withCredentials:true});
        getProfile();
        console.log(result.data)
      } catch (error) {
        console.log(error.response.status);
      }
    }
   //this is to send the otp to the new email
  const updateEmail = async ()=>{
    console.log(emailInput)
    try {
      const response = await api.post("/updateProfile/sendOtp",{email:emailInput},{withCredentials:true});
      setOtpInput(true);
      console.log(response.data.msg);
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const verifyOtp = async ()=>{
    try {
      const response = await api.post("/updateProfile/verifyOtp",{otp});
      getProfile()
      console.log(response.data.msg);
    } catch (error) {
      console.log(error.response.data);
    }
  }
  return (
    <div className="w-full min-h-screen flex justify-center px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl">

        {/* BACK BUTTON */}
        <div className="w-full py-2">
          <button
            className="cursor-pointer w-7"
            onClick={() => setProfile(false)}
          >
            <i className="fa-solid fa-arrow-left" />
          </button>
        </div>

        {/* PROFILE HEADER */}
        <div className="w-full flex flex-col items-center gap-4 py-6 rounded-xl bg-[#8080803f]">
          <div className={`bg-[#ffffff15] hover: p-1 rounded-2xl relative`}>
            {
              loader?(<div  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover">
              <Loader/>
            </div>)  :(
                <img
            src={user.avatar?.url || toplogo}
            alt="profile"
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover"
          />
              )
            }
            
            
          <input type="file" accept='image/' className='hidden' ref={fileRef} onChange={handleAvatarChange}/>
          <button className='cursor-pointer absolute bottom-0 right-0' onClick={()=>fileRef.current?.click()} >
                  <i className="fa-solid fa-pen-to-square"></i>
          </button>
          </div>
          <p className="font-bold text-lg sm:text-xl">
            {user?.name?.toUpperCase()}
          </p>
        </div>

        {/* DETAILS */}
        <div className="w-full mt-6 bg-[#ffffff0e] rounded-xl p-4 flex justify-center">
          <div className="w-full max-w-lg bg-[#00000053] rounded-lg p-4 flex flex-col gap-4">

            <div>
              <p>
                <span className='mr-2'>
                  Email
                  </span> 
                <button className='cursor-pointer' onClick={()=>setEditMode(!editMode)}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
              </p>
              <p className={`font-light break-all ${editMode||otpInput?"hidden":"block"}`}>
                {user.email}
                
              </p>
              <div className={`w-full  p-2 border-[1px] border-white rounded-[10px] flex justify-between items-center ${editMode?"block":"hidden"}`}> 
                  <input type="email" className=' outline-none bg-transparent w-[80%]' value={emailInput} onChange={(e)=>{setEmailInput(e.target.value)}}/>
                  <button className='bg-[green] cursor-pointer font-bold text-amber-100 w-6 rounded-full' onClick={()=>updateEmail()}>
                   <i className="fa-solid fa-check"></i>
                  </button>
                </div>
                <div className={`w-full  p-2 border-[1px] border-white rounded-[10px] flex justify-between items-center ${otpInput?"block":"hidden"}`}> 
                  <input type="text" inputMode="numeric" className=' outline-none bg-transparent w-[80%]' value={otp} onChange={(e)=>{setOtp(e.target.value)}}/>
                  <button className='bg-[green] cursor-pointer font-bold text-amber-100 w-6 rounded-full' onClick={()=>verifyOtp()}>
                   <i className="fa-solid fa-check"></i>
                  </button>
                </div>
            </div>

            <div className="border border-white/10" />

            <div className="flex justify-between flex-wrap gap-4">
              <div>
                <p>
                  DOB
                </p>
                <p className="font-light">
                  {user.dob}
                </p>
                
              </div>

              <div>
                Age
                <p className="font-light">
                  {user.age}
                </p>
              </div>
            </div>

            <div className="border border-white/10" />

            <div>
              Joined at
              <p className="font-light">
                {formatToMonthYear(user.createdAt)}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
