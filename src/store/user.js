import { atom } from "recoil";

export const currentUserState = atom({
  key: "currentUser",
  default: {
    uid: null,
    displayName: "",
    photoURL: "",
  },
});
