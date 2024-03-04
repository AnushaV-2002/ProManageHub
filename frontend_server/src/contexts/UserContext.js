import React from "react";
import { createContext,useState,useEffect } from "react";

const UserContext = createContext({});

export const UserProvider=({children})=>{
    


// Initialize user state with the value from localStorage or null if not present
const [user, setUser] = useState({});


    return(
    <UserContext.Provider value={{
      user,setUser
    }}>
    {children}
    </UserContext.Provider>)
}

export default UserContext;