import { atom, selectorFamily } from "recoil";

export const groupDataState = atom({
  key: "groupData",
  default: [],
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
