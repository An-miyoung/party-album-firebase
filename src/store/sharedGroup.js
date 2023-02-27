import { atom } from "recoil";

export const sharedDataState = atom({
  key: "sharedData",
  default: {
    groupId: null,
    groupName: "",
    groupMembers: [],
    postImages: {},
    timestamp: "",
  },
});
