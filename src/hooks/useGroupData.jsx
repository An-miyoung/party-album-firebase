import { useEffect, useCallback } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useRecoilState } from "recoil";
import { groupDataState } from "../store/groupData";

// 1. realtimeDB 를 읽어와서
// 2. recoil state 에 저장
// 3. data 를 리턴
const useGroupData = () => {
  const [groupData, setGroupData] = useRecoilState(groupDataState);

  const readGroupData = useCallback(() => {
    const groupsRef = ref(db, "groups/");
    onValue(groupsRef, (snapshot) => {
      const data = Object.values(snapshot.val());
      data.map((item) => setGroupData((prev) => [...prev, item]));
      console.log(data);
    });
  }, [setGroupData]);

  useEffect(() => {
    readGroupData();
  }, [readGroupData]);

  return {
    groupData,
  };
};

export default useGroupData;
