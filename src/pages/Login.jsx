import React, { useState, useEffect, useCallback } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import "../firebase";

function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // firebase 명령어를 사용해 로그인
  const loginUser = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      console.log("currentUser : ", user.uid);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (!email || !password) {
        setError("모든 항목을 입력해주세요!");
        return;
      }

      loginUser(email, password);
    },
    [email, loginUser, password]
  );

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);
  useEffect(() => {
    if (!error) return;
    setTimeout(() => {
      setError("");
    }, 3000);
  }, [error]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
        <Typography component="h1" variant="h5">
          로그인
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            name="email"
            required
            fullWidth
            label="이메일"
            margin="normal"
            autoComplete="off"
            autoFocus
            onChange={handleEmailChange}
          />
          <TextField
            name="password"
            required
            fullWidth
            label="비밀번호"
            margin="normal"
            type="password"
            onChange={handlePasswordChange}
          />

          {error && (
            <Alert sx={{ mt: 1 }} severity="error">
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
            로그인
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                to="/join"
                style={{ textDecoration: "none", color: "blue" }}
              >
                계정이 없나요? 회원가입으로 이동
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
