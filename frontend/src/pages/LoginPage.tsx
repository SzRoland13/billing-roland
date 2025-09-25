import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { login } from "../api/services/authService";
import { useUserStore } from "../store/userStore";

const LoginPage = () => {
  const [usernameInput, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { username, accessToken, refreshToken } = useUserStore();

  useEffect(() => {
    if (username && accessToken && refreshToken) {
      navigate("/dashboard");
    }
  }, [username, accessToken, refreshToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(usernameInput, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
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
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, borderRadius: 2 }}
            disabled={!usernameInput || !password}
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
