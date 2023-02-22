import { atom } from "recoil";

export const groupImageState = atom({
  key: "groupImage",
  default: {
    imageId: null,
    downloadUrl: "",
  },
});
