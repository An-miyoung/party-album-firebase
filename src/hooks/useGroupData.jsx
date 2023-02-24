import { useEffect, useCallback } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { groupDataState } from "../store/groupData";
import { currentUserState } from "../store/user";

// 1. realtimeDB 를 읽어와서
// 2. recoil state 에 저장
// 3. data 를 리턴
const useGroupData = () => {
  const { userId } = useRecoilValue(currentUserState);
  const setGroupData = useSetRecoilState(groupDataState);

  const readGroupData = useCallback(() => {
    const groupsRef = ref(db, "groups/" + userId);
    onValue(groupsRef, (snapshot) => {
      const data =
        snapshot.val() !== undefined &&
        snapshot.val() !== null &&
        Object.values(snapshot.val());
      setGroupData(data);
    });
  }, [setGroupData, userId]);

  useEffect(() => {
    readGroupData();
  }, [readGroupData, setGroupData]);
};

export default useGroupData;
