import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { groupDataPicker } from "../store/groupData";

const Post = () => {
  const { guid } = useParams();
  const pickedGroupData = useRecoilValue(groupDataPicker(guid));
  const { groupId, groupName, timestamp } = pickedGroupData[0];
  return (
    <div>
      <div>{groupId}</div>
      <div>{groupName}</div>
      <div>{timestamp}</div>
    </div>
  );
};

export default Post;
