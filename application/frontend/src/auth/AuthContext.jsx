import useUserAuthStore from "../stores/userAuthStore";
import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const { login } = useUserAuthStore();
  const [garbageCollectorColor, setGarbageCollectorColor] = useState("#0000FF");

  return (
    <AuthContext.Provider
      value={{ login, garbageCollectorColor, setGarbageCollectorColor }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
