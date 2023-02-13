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
  const [member, setMember] = useState("");

  const closeModal = useCallback(() => {
    setInputValue("");
    handleClose();
  }, [handleClose, setInputValue]);

  const handleNameInputComplete = useCallback(() => {
    if (inputValue.length > 0) {
      handleCreate();
      handleClose();
    } else {
      alert("내용이 입력되지 않았습니다. 다시 시도해 주세요.");
    }
  }, [handleClose, handleCreate, inputValue.length]);

  const handleMemberInputComplete = useCallback(() => {
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

  const handleMemberStoreSet = () => {
    setInputValue((prev) => [...prev, member]);
    setMember("");
  };

  const renderState = {
    groupName: {
      title: "그룹이름을 입력해 주세요.",
      placeholder: "그룹이름",
      onChange: handleNameChange,
      onComplete: handleNameInputComplete,
    },
    changeName: {
      title: "수정할 그룹이름을 입력해 주세요.",
      placeholder: "그룹이름",
      onChange: handleNameChange,
      onComplete: handleNameInputComplete,
    },
    addMembers: {
      title: "그룹멤버이름을 입력해 주세요.",
      placeholder: "이름입력 후 추가버튼 ",
      onChange: handleMemberChange,
      onComplete: handleMemberInputComplete,
    },
  };

  return (
    <>
      {Object.keys(renderState).map(
        (state, idx) =>
          state === name && (
            <Dialog open={open} onClose={closeModal} key={idx}>
              <DialogTitle>{renderState[state].title}</DialogTitle>
              <DialogContent sx={{ display: "flex", flexDirection: "row" }}>
                <Input
                  type="text"
                  placeholder={renderState[state].placeholder}
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
