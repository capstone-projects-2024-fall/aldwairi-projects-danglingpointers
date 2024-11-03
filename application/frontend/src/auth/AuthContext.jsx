import useUserAuthStore from '../stores/userAuthStore'
import { createContext } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const { login } = useUserAuthStore();

    return (
        <AuthContext.Provider value={{ login }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext