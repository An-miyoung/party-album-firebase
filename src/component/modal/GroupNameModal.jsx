import React, { useCallback } from "react";
import { db } from "../../firebase";
import { set, ref, serverTimestamp } from "firebase/database";
import { uid } from "uid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
} from "@mui/material";
import { useRecoilState } from "recoil";
import { groupNameState } from "../../store/groupName";

const GroupNameModal = ({ open, handleClose, action, guid }) => {
  const [groupName, setGroupName] = useRecoilState(groupNameState);
  const title =
    action === "createName"
      ? "그룹이름을 입력해 주세요."
      : "수정할 그룹이름을 입력해 주세요.";

  const closeModal = useCallback(() => {
    setGroupName("");
    handleClose();
  }, [handleClose, setGroupName]);

  const createToDatabase = useCallback(() => {
    const guid = uid();
    set(ref(db, "groups/" + guid), {
      timestamp: serverTimestamp(),
      groupId: guid,
      groupName,
    });
  }, [groupName]);

  const updateToDatabase = useCallback(() => {
    if (guid !== undefined && guid.length > 0) {
      set(ref(db, "groups/" + guid), {
        timestamp: serverTimestamp(),
        guid,
        groupName,
      });
    }
  }, [groupName, guid]);

  const handleInputComplete = useCallback(() => {
    if (groupName.length > 0) {
      action === "createName" ? createToDatabase() : updateToDatabase();
      handleClose();
    } else {
      alert("내용이 입력되지 않았습니다. 다시 시도해 주세요.");
    }
  }, [
    action,
    createToDatabase,
    groupName.length,
    handleClose,
    updateToDatabase,
  ]);

  const handleChange = (e) => {
    setGroupName(e.target.value);
  };

  return (
    <>
      <Dialog open={open} onClose={closeModal}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Input
            type="text"
            placeholder="그룹이름"
            fullWidth
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>취소</Button>
          <Button onClick={handleInputComplete}>
            {action === "createName" ? "만들기" : "수정하기"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupNameModal;