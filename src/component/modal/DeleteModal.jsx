import React, { useCallback } from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

export const DeleteModal = ({ open, handleClose }) => {
  const closeModal = useCallback(() => {
    handleClose();
  }, [handleClose]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`정말로 앨범을 삭제하시겠습니까?`}</DialogTitle>
      <DialogActions>
        <Button onClick={closeModal}>취소</Button>
        <Button onClick={handleClose}>삭제</Button>
      </DialogActions>
    </Dialog>
  );
};
