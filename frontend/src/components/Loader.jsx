import React from 'react'
import loader from "../assets/loaderInfinity.svg"
const Loader = () => {
  return (
    <div className='flex justify-center bg-transparent items-center w-full h-full'>
     <img src={loader} alt="" className='w-[20%] h-[20%]'/> 
    </div>
  )
}

export default Loader
