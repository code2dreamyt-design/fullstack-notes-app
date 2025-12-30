//import React, { useState } from 'react'
import { Link} from 'react-router-dom'
import UserProfile from './UserProfile'
import toplogo from '/images/noteapplogo.svg'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
const Nav = () => {
  
  const {isAuth} = useContext(AuthContext);
  //console.log(user)
  // const toggleMenu = ()=>{
  //   setIsSmal(!isSmall);
  //   //console.log(isSmall)
  // }
  
  return (
    <div className={`w-full h-10 md:h-12 flex justify-between items-center font-bold shadow-[0px_4px_30px_black] rounded-xl text-amber-200 px-4`}>
      
      {/* <div className='h-full p-2 rounded-[10px] flex justify-center items-center cursor-pointer hover:shadow-[0px_0px_30px_white] text-center' title='Home' onClick={() => navigate("/")}>
        <i className="fa-solid fa-house text-lg md:text-xl"></i>
      </div> */}

      <div className='flex items-center justify-center gap-4 md:gap-20'>
        {/* <div className='h-full p-2 rounded-[10px] flex justify-center items-center cursor-pointer hover:shadow-[0px_0px_30px_white] text-center' title='about'>
          <i className="fa-regular fa-address-card text-lg md:text-xl"></i>
        </div> */}
        
        {/* <div className='h-full p-2 rounded-[10px] flex justify-center items-center cursor-pointer hover:shadow-[0px_0px_30px_white] text-center' title='Logout' onClick={() => makeLogout()}>
          <i className="fa-solid fa-right-from-bracket text-lg md:text-xl"></i>
        </div> */}
        <img src={toplogo} className='h-25 rounded-full'/>
      </div>

      <div className='h-15  flex items-center'>
        {
          isAuth ? <UserProfile/>:''
          
        }
          
      </div>
    </div>
  )
}

export default Nav
