import React from "react";
import { createContext,useState,useEffect } from "react";
import Cookies from 'js-cookie';

const AuthContext = createContext({});

export const AuthProvider=({children})=>{

    const [isAuthenticated, setIsAuthenticated] = useState(
      localStorage.getItem('isAuthenticated') === 'true' || false
    );
  
    useEffect(() => {
      localStorage.setItem('isAuthenticated', isAuthenticated);
      console.log(isAuthenticated);
    }, [isAuthenticated]);
    
    const login = (token) => {
      Cookies.set('token', token, { expires: 1/24 });// Expires in 1 hour
      console.log(token) 
      setIsAuthenticated(true);
    };

    const logout = () => {
      Cookies.remove('token');
      setIsAuthenticated(false);
    };
        
    return(
        <AuthContext.Provider value={{ isAuthenticated,login, logout}}>
          {children}
        </AuthContext.Provider>
    )
    }
    
export default AuthContext;