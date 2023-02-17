import React, { useCallback, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
} from "@mui/material";

const AddMembersModal = ({
  open,
  handleClose,
  inputValue,
  setInputValue,
  handleCreate,
}) => {
  const [member, setMember] = useState("");

  const closeModal = useCallback(() => {
    setInputValue("");
    handleClose();
  }, [handleClose, setInputValue]);

  const handleInputComplete = useCallback(() => {
    if (inputValue?.length > 0) {
      handleCreate();
      setMember("");
      handleClose();
    } else {
      alert("내용이 입력되지 않았습니다. 다시 시도해 주세요.");
    }
  }, [handleClose, handleCreate, inputValue?.length]);

  const handleChange = useCallback((e) => {
    setMember(e.target.value);
  }, []);

  const handleMemberStoreSet = useCallback(() => {
    setInputValue((prev) => [...prev, member]);
    setMember("");
  }, [member, setInputValue]);

  return (
    <>
      <Dialog open={open} onClose={closeModal}>
        <DialogTitle>그룹멤버 이름을 입력해 주세요.</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "row" }}>
          <Input
            type="text"
            placeholder="이름입력 후 추가버튼"
            fullWidth
            value={member}
            onChange={handleChange}
          />
          <Button variant="outlined" onClick={handleMemberStoreSet}>
            추가
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>취소</Button>
          <Button onClick={handleInputComplete}>만들기</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddMembersModal;
