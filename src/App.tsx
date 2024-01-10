import {
  Box,
  Container,
  Stack,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function App() {
  const [answer, setAnswer] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const handleUnlock = async () => {
    await Swal.fire({
      title: "Input Roblox Answer",
      showCancelButton: true,
      input: "text",
      inputLabel: "Your Answer",
      inputPlaceholder: "Enter your answer",
      inputValidator: (value) => {
        if (!value) {
          return "You need to fill the answer";
        } else {
          setAnswer(value);
          setAttempted(true);
        }
      },
    });
  };

  useEffect(() => {
    let intervalId: any;

    if (answer !== "ddd" && attempted && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    if (countdown == 0) {
      setAttempted(false);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [answer, attempted, countdown]);
  return (
    <Box width={"100vw"} height={"100vh"}>
      <Container maxWidth="lg" sx={{ height: "100%" }}>
        <Stack
          justifyContent={"center"}
          // alignItems={"center"}
          width={"100%"}
          height={"100%"}
        >
          <Typography
            fontWeight={"bold"}
            fontSize={"5rem"}
            marginBottom={"1rem"}
          >
            Question 1
          </Typography>
          <Stack direction={"row"} width={"100%"} spacing={"1rem"}>
            <TextField fullWidth label="answer" disabled={answer != "ddd"} />
            <Button
              disabled={attempted && (answer !== "ddd" || countdown !== 0)}
              variant="contained"
              startIcon={
                answer == "ddd" ? <CheckCircleIcon /> : <LockOpenIcon />
              }
              sx={{
                paddingX: "3rem",
                backgroundColor: answer == "ddd" ? "green" : "blue",
              }}
              onClick={handleUnlock}
            >
              {answer !== ""
                ? answer === "ddd"
                  ? "Success"
                  : countdown > 0
                  ? `${countdown}s`
                  : "Unlock"
                : "Unlock"}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
