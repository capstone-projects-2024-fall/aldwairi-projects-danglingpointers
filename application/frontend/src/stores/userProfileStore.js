import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserProfileStore = create(
  persist(
    (set) => ({
      profileId: null,
      setProfileId: (id) => set({ profileId: id }),
    }),
    {
      name: "user-profile-store",
      storage: sessionStorage,
    }
  )
);

export default useUserProfileStore;
