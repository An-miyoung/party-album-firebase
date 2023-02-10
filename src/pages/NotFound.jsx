import React from "react";
import { Container, Box, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

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
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component="h1" variant="h5">
                해당페이지는 존재하지 않습니다.
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div style={{ height: "5vh" }} />
          </Grid>
          <Grid container justifyContent="flex-end">
            <Grid
              item
              onClick={() => {
                navigate(-1);
              }}
              sx={{
                cursor: "pointer",
                color: "blue",
              }}
            >
              이전 페이지로 이동
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default NotFound;
