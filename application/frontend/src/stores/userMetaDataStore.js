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
      items: null,

      createUserMetaData: async (formData) => {
        const response = await axios.post(
          `${HOST_PATH}/create-user-metadata/`,
          formData
        );

        set(() => ({
          isMetaDataSet: true,
          points: response.data.user_points,
          settings: response.data.settings,
          items: response.data.items,
        }));
      },
      setUserMetaData: async (formData) => {
        const response = await axios.get(
          `${HOST_PATH}/user-metadata/?user_id=${formData.user_id}`
        );

        set(() => ({
          isMetaDataSet: true,
          points: response.data[0].user_points,
          settings: response.data[0].settings,
          items: response.data[0].items,
        }));
      },
      logoutUserMetaData: async () => {
        set(() => ({
          isMetaDataSet: false,
          points: null,
          settings: null,
          items: null,
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
