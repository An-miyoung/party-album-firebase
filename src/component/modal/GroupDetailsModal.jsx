import React, { useCallback, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Typography,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { groupNameState } from "../../store/groupName";
import { groupMembersState } from "../../store/groupMembers";

const GroupDetailsModal = ({
  open,
  handleClose,
  name,
  inputValue,
  setInputValue,
  handleCreate,
}) => {
  // changeGroupName 이 호출될때 필요사항
  const groupName = useRecoilValue(groupNameState);

  // addMembers 가 호출될때 필요사항
  const groupMembers = useRecoilValue(groupMembersState);
  const groupMembersString = groupMembers?.join(",") || null;
  const [member, setMember] = useState("");

  const closeModal = useCallback(() => {
    setInputValue("");
    handleClose();
  }, [handleClose, setInputValue]);

  const handleInputComplete = useCallback(() => {
    if (inputValue.length > 0) {
      handleCreate();
      handleClose();
    } else {
      alert("내용이 입력되지 않았습니다. 다시 시도해 주세요.");
    }
  }, [handleClose, handleCreate, inputValue.length]);

  const handleNameChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleMemberChange = (e) => {
    console.log(e.target.value);
    setMember(e.target.value);
  };

  const handleMemberStoreSet = (e) => {
    setInputValue((prev) => [...prev, member]);
    setMember("");
  };

  const renderState = {
    groupName: {
      title: "그룹이름을 입력해 주세요.",
      placeholder: "그룹이름",
      showData: null,
      onChange: handleNameChange,
      onComplete: handleInputComplete,
    },
    changeName: {
      title: "수정할 그룹이름을 입력해 주세요.",
      placeholder: "그룹이름",
      showData: groupName,
      onChange: handleNameChange,
      onComplete: handleInputComplete,
    },
    addMembers: {
      title: "그룹멤버이름을 입력해 주세요.",
      placeholder: "이름입력 후 추가버튼 ",
      showData: groupMembersString,
      onChange: handleMemberChange,
      onComplete: handleInputComplete,
    },
  };

  return (
    <>
      {Object.keys(renderState).map(
        (state, idx) =>
          state === name && (
            <Dialog open={open} onClose={closeModal} key={idx}>
              <DialogTitle>{renderState[state].title}</DialogTitle>
              <DialogContent>{renderState[state].showData}</DialogContent>
              <DialogContent sx={{ display: "flex", flexDirection: "row" }}>
                <Input
                  type="text"
                  placeholder={renderState[state].placeholder}
                  value={member}
                  fullWidth
                  onChange={renderState[state].onChange}
                />
                {state === "addMembers" && (
                  <Button variant="outlined" onClick={handleMemberStoreSet}>
                    추가
                  </Button>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={closeModal}>취소</Button>
                <Button onClick={renderState[state].onComplete}>만들기</Button>
              </DialogActions>
            </Dialog>
          )
      )}
    </>
  );
};

export default GroupDetailsModal;
