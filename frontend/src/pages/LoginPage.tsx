import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { login } from "../api/services/authService";
import { useUserStore } from "../store/userStore";
import { useCaptchaStore } from "../store/captchaStore";
import { fetchCaptcha } from "../api/services/captchaService";

const LoginPage = () => {
  const [usernameInput, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const navigate = useNavigate();

  const { username, accessToken, refreshToken } = useUserStore();
  const { sessionId, imageUrl, captchaInput, setCaptchaInput } =
    useCaptchaStore();

  useEffect(() => {
    if (username && accessToken && refreshToken) {
      navigate("/dashboard");
    }
  }, [username, accessToken, refreshToken, navigate]);

  useEffect(() => {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(
        usernameInput,
        password,
        showCaptcha ? sessionId ?? undefined : undefined,
        showCaptcha ? captchaInput : undefined
      );
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 401 && err.response?.data?.captchaRequired) {
        setShowCaptcha(true);
        await fetchCaptcha();
        setError(err.response?.data?.message || "Please solve the CAPTCHA");
      } else {
        setError("Invalid username or password");
      }

      console.warn("Received error message: ", err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5" sx={{ color: "black" }}>
          Login
        </Typography>
        <Box component="form" mt={2} onSubmit={handleSubmit} width="100%">
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={usernameInput}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showCaptcha && imageUrl && (
            <Box mt={2}>
              <img
                src={imageUrl}
                alt="CAPTCHA"
                style={{ width: "100%", marginBottom: 8 }}
              />
              <TextField
                label="Enter CAPTCHA"
                fullWidth
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                margin="normal"
              />
            </Box>
          )}
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, borderRadius: 2 }}
            disabled={
              !usernameInput ||
              !password ||
              (showCaptcha && (!captchaInput || !sessionId))
            }
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="text"
            sx={{ mt: 4 }}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
