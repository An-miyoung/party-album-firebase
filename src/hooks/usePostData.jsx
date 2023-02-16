import { useEffect, useCallback } from "react";
import { db } from "../firebase";
import { ref, get, child } from "firebase/database";
import { useSetRecoilState } from "recoil";
import { groupIdState } from "../store/groupId";
import { groupNameState } from "../store/groupName";
import { groupMembersState } from "../store/groupMembers";

// 1. realtimeDB 를 읽어와서
// 2. recoil state 에 저장
// 3. data 를 리턴
const usePostData = ({ guid }) => {
  console.group("진입");
  const setGroupId = useSetRecoilState(groupIdState);
  const setGroupName = useSetRecoilState(groupNameState);
  const setGroupMembers = useSetRecoilState(groupMembersState);

  const readPostData = useCallback(() => {
    const dbRef = ref(db);
    console.log("dbref : ", dbRef);
    get(child(dbRef, `groups/${guid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log("snapshot : ", data);
          setGroupId(data.groupId);
          setGroupName(data.groupName);
          setGroupMembers(data.groupMembers);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [guid, setGroupId, setGroupMembers, setGroupName]);

  readPostData();
};

export default usePostData;
