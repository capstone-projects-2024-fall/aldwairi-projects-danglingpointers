import useUserAuthStore from "../stores/userAuthStore";
import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const { login } = useUserAuthStore();
  const [profiles, setProfiles] = useState([]);

  return (
    <AuthContext.Provider
      value={{
        login,
        profiles,
        setProfiles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
