import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { HOST_PATH } from "../scripts/constants";

const useUserAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: "",
      refreshToken: "",
      userId: null,
      username: null,
      login: async (formData) => {
        const response = await axios.post(`${HOST_PATH}/login/`, formData);

        set(() => ({
          isLoggedIn: true,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          userId: response.data.user_id,
          username: response.data.username,
        }));
      },
      logout: async () => {
        set(() => ({
          isLoggedIn: false,
          accessToken: "",
          refreshToken: "",
          userId: null,
          username: null,
        }));
      },
    }),
    {
      name: "user-auth-state",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUserAuthStore;
