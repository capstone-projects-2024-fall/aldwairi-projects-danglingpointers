import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { HOST_PATH } from "../scripts/constants";

const useUserMetaDataStore = create(
  persist(
    (set) => ({
      isMetaDataSet: false,
      points: null,
      settings: null,

      createUserMetaData: async (formData) => {
        const response = await axios.post(
          `${HOST_PATH}/create-user-metadata/`,
          formData
        );

        set(() => ({
          isMetaDataSet: true,
          points: response.data.user_points,
          settings: response.data.settings,
        }));
      },
      setUserMetaData: async (formData) => {
        const response = await axios.get(
          `${HOST_PATH}/user-metadata/?user_id=${formData.userId}`
        );

        set(() => ({
          isMetaDataSet: true,
          points: response.data[0].user_points,
          settings: response.data[0].settings,
        }));
      },
      unloadUserMetaData: async (formData) => {
        await axios.post(`${HOST_PATH}/save-user-metadata/`, formData);

        set(() => ({
          isMetaDataSet: false,
          points: null,
          settings: null,
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
