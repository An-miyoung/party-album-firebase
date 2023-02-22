import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Box,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import md5 from "md5";
import { useRecoilState } from "recoil";
import { currentUserState } from "../store/user";

const IsPasswordValid = (password, confirmPassword) => {
  if (password.length < 6 || confirmPassword.length < 6) {
    return false;
  } else if (password !== confirmPassword) {
    return false;
  } else {
    return true;
  }
};

function TestJoin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

  const handleNameChange = useCallback((e) => {
    setName(e.target.value);
  }, []);
  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);
  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);
  const handleConfirmPasswordChange = useCallback((e) => {
    setConfirmPassword(e.target.value);
  }, []);

  const loginEmailPassword = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
    } catch (error) {
      alert(error.message);
    }
  };

  const createAccount = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(user, {
        displayName: name,
        photoURL: `https://www.gravatar.com/avatar/${md5(email)}?d=retro`,
      });

      console.log(user);
      setCurrentUser({
        displayName: name,
        photoURL: `https://www.gravatar.com/avatar/${md5(email)}?d=retro`,
      });

      await set(ref(db, "users/" + user.uid), {
        name: user.displayName,
        avatar: user.photoURL,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const monitorAuthState = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
      } else {
        console.log("logout");
      }
    });
  };

  monitorAuthState();

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ paddingTop: "10vh" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
        <Typography component="h1" variant="h5">
          회원가입
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                required
                fullWidth
                label="닉네임"
                autoFocus
                onChange={handleNameChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                required
                fullWidth
                label="이메일"
                autoComplete="off"
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                required
                fullWidth
                label="비밀번호"
                type="password"
                onChange={handlePasswordChange}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                required
                fullWidth
                label="비밀번호확인"
                type="password"
                onChange={handleConfirmPasswordChange}
              />
            </Grid> */}
          </Grid>

          {/* <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 2 }}
          >
            회원가입
          </LoadingButton> */}
          <Grid container justifyContent="flex-end">
            <Grid item>
              이미 계정이 있나요? 로그인으로 이동
              <Button onClick={loginEmailPassword}>로그인</Button>
              <Button onClick={createAccount}>회원가입</Button>
              <Button onClick={logout}>로그아웃</Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {Object.keys(currentUser).length > 0 && console.log(currentUser)}
    </Container>
  );
}

export default TestJoin;
