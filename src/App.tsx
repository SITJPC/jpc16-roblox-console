import {
  Box,
  Container,
  Stack,
  TextField,
  Typography,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import { RobloxAnswer } from "./data/answer";

function App() {
  const [answer, setAnswer] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [question, setQuestion] = useState("1");
  const [value, setValue] = useState("");
  const [correct, setCorrect] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setQuestion(event.target.value as string);
  };

  const handleUnlock = async () => {
    if (value != "") {
      if (value == "bbb") {
        Swal.fire({
          title: "Answer Correct",
          icon: "success",
        });
        setCorrect(true);
      } else {
        Swal.fire({
          title: "Wrong Correct",
          icon: "error",
        });
      }
    } else {
      const { value: text } = await Swal.fire({
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
      if (text == "ddd") {
        Swal.fire({
          title: "Answer Correct",
          icon: "success",
        });
      }
    }
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
        <Stack justifyContent={"center"} width={"100%"} height={"100%"}>
          <Stack direction={"row"} alignItems={"center"}>
            <Typography
              fontWeight={"bold"}
              fontSize={"5rem"}
              marginBottom={"1rem"}
            >
              {`Question ${question}`}
            </Typography>
            <Box sx={{ minWidth: 120, marginLeft: "1.5rem" }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Question</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={question}
                  label="Question"
                  onChange={handleChange}
                >
                  {RobloxAnswer.map((el) => (
                    <MenuItem value={el.question}>
                      Question {el.question}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>

          <Stack direction={"row"} width={"100%"} spacing={"1rem"}>
            <TextField
              fullWidth
              label="answer"
              disabled={answer != "ddd" || correct}
              onChange={(el) => {
                setValue(el.target.value);
              }}
            />
            <Button
              disabled={
                attempted &&
                (answer !== "ddd" || countdown !== 0) &&
                value === "" || correct
              }
              variant="contained"
              startIcon={answer == "ddd" ? <LockOpenIcon /> : <LockIcon />}
              sx={{
                paddingX: "3rem",
                backgroundColor: answer == "ddd" ? "green" : "blue",
              }}
              onClick={handleUnlock}
            >
              {answer !== ""
                ? answer == "ddd"
                  ? "Submit"
                  : countdown > 0
                  ? `${countdown}s`
                  : "Unlock"
                : "Unlock"}
            </Button>
            {correct ? (
              <CheckCircleIcon sx={{ color: "green", fontSize: "3rem" }} />
            ) : (
              ""
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
