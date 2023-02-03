import React, { useCallback } from "react";
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
}) => {
  const closeModal = useCallback(() => {
    setInputValue("");
    handleClose();
  }, [handleClose, setInputValue]);

  const handleInputComplete = useCallback(() => {
    if (inputValue.length > 0) {
      handleClose();
    } else {
      alert("내용이 입력되지 않았습니다. 다시 시도해 주세요.");
    }
  }, [handleClose, inputValue.length]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
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
              onChange={handleChange}
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
              onChange={handleChange}
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
