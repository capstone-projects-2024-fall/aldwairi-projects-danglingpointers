import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { HOST_PATH } from "../scripts/constants";

const useUserMetaDataStore = create(
  persist(
    (set) => ({
      settings: null,
      createUserMetaData: async (formData) => {
        const response = await axios.post(`${HOST_PATH}/create-user-metadata/`, formData);

        set(() => ({
          settings: response.data.settings,
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
