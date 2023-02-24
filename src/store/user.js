import { atom } from "recoil";

export const currentUserState = atom({
  key: "currentUser",
  default: {
    userId: null,
    displayName: "",
    photoURL: "",
  },
});
