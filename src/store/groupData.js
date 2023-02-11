import { atom, selectorFamily } from "recoil";

export const groupDataState = atom({
  key: "groupData",
  default: [
    // {
    //   groupId: undefined,
    //   groupName: "",
    //   groupMembers: [],
    //   timestamp: undefined,
    // },
  ],
});

export const groupDataPicker = selectorFamily({
  key: "groupDataPicker",
  get:
    (pickedGroupId) =>
    ({ get }) => {
      return get(groupDataState).filter(
        (groupData) => groupData.groupId === pickedGroupId
      );
    },
});
