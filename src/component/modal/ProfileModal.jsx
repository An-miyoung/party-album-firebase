import React, { useState, useCallback, useRef, useEffect } from "react";
import { db, storage } from "../../firebase";
import {
  getDownloadURL,
  ref as refStorage,
  uploadBytes,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { ref, update } from "firebase/database";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
} from "@mui/material";
import { Stack } from "@mui/system";
import AvatarEditor from "react-avatar-editor";
import { useRecoilValue } from "recoil";
import { currentUserState } from "../../store/user";

function ProfileModal({ open, handleClose }) {
  const { uid } = useRecoilValue(currentUserState);
  const [previewImage, setPreviewImage] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [blob, setBlob] = useState("");
  const avatarEditorRef = useRef(null);

  const closeModal = useCallback(() => {
    handleClose();
    setBlob("");
    setCroppedImage("");
    setPreviewImage("");
    setUploadedImage("");
  }, [handleClose]);

  const handleChange = useCallback((e) => {
    const profileImageFile = e.target.files[0];
    if (!profileImageFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(profileImageFile);
    reader.addEventListener("load", () => {
      setPreviewImage(reader.result);
    });
  }, []);

  const handleCropImage = useCallback(() => {
    avatarEditorRef.current.getImageScaledToCanvas().toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      setCroppedImage(imageUrl);
      setBlob(blob);
    });
  }, []);

  const uploadCroppedImage = useCallback(async () => {
    if (!uid) return;

    // firebase storae 에 주소를 만들어주고
    const storageRef = refStorage(storage, `avatars/users/${uid}`);
    const uploadTask = await uploadBytes(storageRef, blob);
    // 채팅화면에서 이미지를 저장하고 downloadUrl을 만들때는 uploadTask.snapshot.ref 였음.
    const downloadUrl = await getDownloadURL(uploadTask.ref);
    setUploadedImage(downloadUrl);
  }, [blob, uid]);

  // useEffect(() => {
  //   if (!uploadedImage || !uid) return;

  //   // firebase auth 의 메소드를 사용해 update
  //   async function changeAvatar() {
  //     await updateProfile(user.currentUser, { photoURL: uploadedImage });

  //     // firebase db 에 저장
  //     const updates = {};
  //     updates["/users/" + user.currentUser.uid + "/avatar"] = uploadedImage;
  //     await update(ref(getDatabase()), updates);
  //     closeModal();
  //   }

  //   changeAvatar();
  // }, [uploadedImage, user.currentUser, closeModal]);

  return (
    <Dialog open={open} onClose={closeModal}>
      <DialogTitle>프로필 이미지 변경</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={3}>
          <Input
            type="file"
            inputProps={{
              accept: "image/jpg, image/jpeg, image/gif, image/png ",
            }}
            label="변경할 프로필 이미지 선택"
            onChange={handleChange}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            {previewImage && (
              <AvatarEditor
                image={previewImage}
                width={120}
                height={120}
                border={50}
                scale={2}
                style={{ display: "inline" }}
                ref={avatarEditorRef}
              />
            )}
            {croppedImage && (
              <img
                src={croppedImage}
                alt="profile"
                style={{ marginLeft: "50px" }}
                width={100}
                height={100}
              />
            )}
          </div>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>취소</Button>
        {previewImage && <Button onClick={handleCropImage}>이미지 Crop</Button>}
        {croppedImage && (
          <Button onClick={uploadCroppedImage}>이미지 수정</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ProfileModal;
