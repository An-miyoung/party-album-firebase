import React, { useCallback, useState } from "react";
import styled from "styled-components";
import GroupDetailsModal from "./modal/GroupDetailsModal";
import { useRecoilState } from "recoil";
import { groupNameState } from "../store/groupName";
import { db } from "../firebase";
import { set, ref, serverTimestamp } from "firebase/database";
import { uid } from "uid";

const CreateGroup = () => {
  const [showGroupDetailsModal, setShowGroupDetailsModal] = useState(false);
  const [groupName, setGroupName] = useRecoilState(groupNameState);

  const handleShowGroupDetailsModal = useCallback(() => {
    setShowGroupDetailsModal(false);
  }, []);

  const handleCreateGroup = useCallback(() => {
    setShowGroupDetailsModal(true);
  }, []);

  const writeToDatabase = useCallback(() => {
    const guid = uid();
    set(ref(db, "groups/" + guid), {
      timestamp: serverTimestamp(),
      groupId: guid,
      groupName,
    });
  }, [groupName]);

  return (
    <StyleButtonContainer>
      <StyleButtonContainer>
        <StyleButtonLocation>
          <StyleInfoText>
            모임추가 버튼을 누르고 새 앨범을 만드세요.
          </StyleInfoText>
          <StyleButton onClick={handleCreateGroup}>모임 추가</StyleButton>
        </StyleButtonLocation>
        <GroupDetailsModal
          open={showGroupDetailsModal}
          handleClose={handleShowGroupDetailsModal}
          name="createName"
          inputValue={groupName}
          setInputValue={setGroupName}
          handleCreate={writeToDatabase}
        />
      </StyleButtonContainer>
    </StyleButtonContainer>
  );
};

export default CreateGroup;

const StyleButtonContainer = styled.div`
  position: relative;
`;

const StyleInfoText = styled.div`
  width: 50vw;
  position: fixed;
  left: 5vw;
  top: 80px;
  color: #31383f;

  @media screen and (max-width: 500px) {
    height: 40px;
    font-size: 5vw;
  }
`;

const StyleButtonLocation = styled.div`
  position: fixed;
  right: 5vw;
  top: 80px;
  z-index: 999;
`;

const StyleButton = styled.button`
  /* width: 60%; */
  height: 8vh;
  margin: 0 auto;
  padding: 0 10px;
  background-color: #31383f;
  border-radius: 8px;
  border: none;
  color: whitesmoke;
  font-size: 20px;
  font-weight: 500;

  cursor: pointer;

  &:hover {
    background: #9c27b0;
    filter: brightness(70%);
  }

  @media screen and (max-width: 500px) {
    height: 40px;
    font-size: 5vw;
  }
`;
