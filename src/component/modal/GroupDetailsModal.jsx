import React, { useCallback, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
} from "@mui/material";

const GroupDetailsModal = ({
  open,
  handleClose,
  name,
  inputValue,
  setInputValue,
  handleCreate,
}) => {
  const [memberString, setMembersString] = useState("");

  const closeModal = useCallback(() => {
    setInputValue("");
    handleClose();
  }, [handleClose, setInputValue]);

  const handleInputComplete = useCallback(() => {
    if (inputValue.length > 0) {
      handleCreate();
      handleClose();
    } else if (memberString.length > 0) {
      console.log(memberString.trim().split(","));
      setInputValue(memberString.trim().split(","));
      handleCreate();
      handleClose();
    } else {
      alert("내용이 입력되지 않았습니다. 다시 시도해 주세요.");
    }
  }, [
    handleClose,
    handleCreate,
    inputValue.length,
    memberString,
    setInputValue,
  ]);

  const handleNameChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleMemberChange = (e) => {
    console.log(e.target.value);
    setMembersString(e.target.value);
  };

  return (
    <Dialog open={open} onClose={closeModal}>
      {name === "groupName" ? (
        <>
          <DialogTitle>그룹이름을 입력해 주세요.</DialogTitle>
          <DialogContent>
            <Input
              type="text"
              placeholder="그룹이름"
              fullWidth
              onChange={handleNameChange}
            />
          </DialogContent>
        </>
      ) : (
        <>
          <DialogTitle>그룹멤버들을 입력해 주세요.</DialogTitle>
          <DialogContent>
            <Input
              type="text"
              placeholder="멤버이름"
              fullWidth
              onChange={handleMemberChange}
            />
          </DialogContent>
        </>
      )}

      <DialogActions>
        <Button onClick={closeModal}>취소</Button>
        <Button onClick={handleInputComplete}>만들기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupDetailsModal;
