import { atom } from "recoil";

export const groupImagesState = atom({
  key: "groupImages",
  default: {
    image: "",
    timestamp: null,
  },
});
