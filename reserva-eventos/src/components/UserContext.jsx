import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8090/auth/me", {
      withCredentials: true,
    }).then(res => {
      const { roles, nombreCompleto } = res.data;
      setUser({ roles, nombreCompleto });
    }).catch(() => {
      setUser(null);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
