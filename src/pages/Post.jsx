import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Header from "../component/Header";
import { groupDataPicker } from "../store/groupData";

const Post = () => {
  const { guid } = useParams();
  const pickedGroupData = useRecoilValue(groupDataPicker(guid));
  const { groupId, groupName, timestamp } = pickedGroupData[0];
  return (
    <div>
      <Header />
      <div style={{ height: "100px" }} />
      <div>{groupId}</div>
      <div>{groupName}</div>
      <div>{timestamp}</div>
    </div>
  );
};

export default Post;
