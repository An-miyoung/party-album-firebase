import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import { groupNameState } from "../store/groupName";
import GroupDetailsModal from "../component/modal/GroupDetailsModal";

const CreateGroup = () => {
  const { guid } = useParams();

  const [showGroupDetailsModal, setShowGroupDetailsModal] = useState(false);
  const [groupName, setGroupName] = useRecoilState(groupNameState);

  const handleShowGroupDetailsModal = useCallback(() => {
    setShowGroupDetailsModal(false);
  }, []);

  useEffect(() => {
    if (guid === undefined || guid === null) {
      setShowGroupDetailsModal(true);
    }
    console.log(guid);
  }, [guid]);
  return (
    <>
      <GroupDetailsModal
        open={showGroupDetailsModal}
        handleClose={handleShowGroupDetailsModal}
        name="그룹이름"
        inputValue={groupName}
        setInputValue={setGroupName}
      />
    </>
  );
};

export default CreateGroup;
