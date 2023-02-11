import React, { useCallback } from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

export const DeleteModal = ({ open, handleClose, handleConfirm }) => {
  const closeModal = useCallback(() => {
    handleConfirm(false);
    handleClose();
  }, [handleClose, handleConfirm]);

  const groupDataDelete = useCallback(() => {
    handleConfirm(true);
    handleClose();
  }, [handleClose, handleConfirm]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`정말로 앨범을 삭제하시겠습니까?`}</DialogTitle>
      <DialogActions>
        <Button onClick={closeModal}>취소</Button>
        <Button onClick={groupDataDelete}>삭제</Button>
      </DialogActions>
    </Dialog>
  );
};
