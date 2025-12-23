import React, { useState } from 'react';
import { createContext } from 'react';

export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
  const [isAuth,setIsAuth]= useState(false);
 const [loading,setLoading] = useState(true);
 const [user,setUser] = useState(''); 
  return (
    <AuthContext.Provider value={{isAuth,setIsAuth,loading,setLoading,user,setUser}}>
      {children}
    </AuthContext.Provider>
  )
}


