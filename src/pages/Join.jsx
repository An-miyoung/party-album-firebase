import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Box,
  Avatar,
  Typography,
  Grid,
  TextField,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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

function Join() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const postUserData = useCallback(
    async (name, email, password) => {
      setLoading(true);
      try {
        // firebase 명령어를 이용해 사용자개정을 만든다. 즉시 로그인 상태로 바뀐다.
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(user, {
          displayName: name,
          photoURL: `https://www.gravatar.com/avatar/${md5(email)}?d=wavatar`,
        });
        console.log(user);

        // email, password 는 auth 에서 관리
        // displayName, photoUrl 은 userProfile 에서 관리
        // 동일한 내용을 name, avatar로  realtimeDatabase 에서 관리
        await set(ref(db, "users/" + user.uid), {
          name: user.displayName,
          avatar: user.photoURL,
        });
        setLoading(false);

        // displayName 과 photoUrl 이 만들어진 후 frontend  내 보관
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    },
    [setCurrentUser]
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (!name || !email || !password || !confirmPassword) {
        setError("모든 항목을 입력해주세요.");
        return;
      }

      if (!IsPasswordValid(password, confirmPassword)) {
        setError("비밀번호가 다릅니다. 확인후 다시 입력해 주세요");
        return;
      }
      postUserData(name, email, password);
    },
    [confirmPassword, email, name, password, postUserData]
  );

  useEffect(() => {
    if (!error) return;
    setTimeout(() => {}, 3000);
  }, [error]);

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
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                required
                fullWidth
                label="비밀번호확인"
                type="password"
                onChange={handleConfirmPasswordChange}
              />
            </Grid>
          </Grid>
          {error && (
            <Alert sx={{ mt: 3 }} severity="error">
              {error}
            </Alert>
          )}
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 2 }}
            loading={loading}
          >
            회원가입
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "blue" }}
              >
                이미 계정이 있나요? 로그인으로 이동
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Join;
