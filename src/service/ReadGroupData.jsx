import React, { useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useRecoilState } from "recoil";
import { groupDataState } from "../store/groupData";

export const ReadGroupData = () => {
  const [groupData, setGroupData] = useRecoilState(groupDataState);
  const groupsRef = ref(db, "groups/");
  onValue(groupsRef, (snapshot) => {
    const data = Object.values(snapshot.val());
    data.map((item) => setGroupData((prev) => [...prev, item]));
    console.log(data);
  });
  return groupData;
};
