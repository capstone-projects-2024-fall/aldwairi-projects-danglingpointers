import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";

const useUserAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: "",
      refreshToken: "",
      userId: null,
      login: async (formData) => {
        const HOST_PATH = "http://localhost:8000/api/login/";
        const response = await axios.post(HOST_PATH, formData);
        console.log(response.data);

        set(() => ({
          isLoggedIn: true,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          userId: response.data.user_id,
        }));
      },
      logout: async () => {
        set(() => ({
          isLoggedIn: false,
          accessToken: "",
          refreshToken: "",
          userId: null,
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
