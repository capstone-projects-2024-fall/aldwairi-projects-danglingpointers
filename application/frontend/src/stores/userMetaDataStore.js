import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { HOST_PATH } from "../scripts/constants";

const useUserMetaDataStore = create(
  persist(
    (set) => ({
      settings: null,
      createUserMetaData: async (formData) => {
        const response = await axios.post(
          `${HOST_PATH}/create-user-metadata/`,
          formData
        );

        set(() => ({
          points: response.data.user_points,
          settings: response.data.settings,
        }));
      },
      setUserMetaData: async (formData) => {
        const response = await axios.get(
          `${HOST_PATH}/user-metadata/?user_id=${formData.userId}`
        );

        set(() => ({
          points: response.data[0].user_points,
          settings: response.data[0].settings,
        }));
      },
    }),
    {
      name: "user-metadata-state",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUserMetaDataStore;
