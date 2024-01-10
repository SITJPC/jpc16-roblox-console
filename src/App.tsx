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
import { useCookies } from "react-cookie";

function App() {
  const [cookies, setCookie] = useCookies(
    RobloxAnswer.map((el) => el.question)
  );

  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnser2] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [question, setQuestion] = useState(cookies.current);

  const handleChange = (event: SelectChangeEvent) => {
    setQuestion(event.target.value as string);
  };
  console.log(attempted);

  const handleUnlock = async () => {
    if (answer2 != "") {
      if (
        answer2 ==
        RobloxAnswer.find((item) => item.question == question)?.secondAnswer
      ) {
        Swal.fire({
          title: "Answer Correct",
          icon: "success",
        });
        setCookie(question, true);
        setAnswer1("");
        setAnser2("");
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
            console.log("set answer1 ja");
            setAnswer1(value);
            setAttempted(true);
          }
        },
      });
      if (
        text ==
        RobloxAnswer.find((item) => item.question == question)?.firstAnswer
      ) {
        console.log("correct!");
        Swal.fire({
          title: "Answer Correct",
          icon: "success",
        });
      }
    }
  };

  useEffect(() => {
    RobloxAnswer.map((el) => {
      if (cookies[el.question] == undefined) {
        setCookie(el.question, false);
      }
    });
  }, []);

  useEffect(() => {
    setCookie("current", question);
    let intervalId: any;

    if (
      answer1 !==
        RobloxAnswer.find((item) => item.question == question)?.firstAnswer &&
      attempted &&
      countdown > 0
    ) {
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    if (countdown == 0) {
      setAttempted(false);
      setCountdown(10);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [answer1, attempted, countdown, question]);

  return (
    <Box width={"100vw"} height={"100vh"}>
      <Container maxWidth="lg" sx={{ height: "100%" }}>
        <Stack justifyContent={"center"} width={"100%"} height={"100%"}>
          <Stack direction={"row"} alignItems={"center"}>
            <Typography
              fontWeight={"bold"}
              fontSize={"5rem"}
              marginBottom={"1rem"}
              color={"black"}
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
              disabled={
                answer1 !=
                  RobloxAnswer.find((item) => item.question == question)
                    ?.firstAnswer || cookies[question]
              }
              onChange={(el) => {
                setAnser2(el.target.value);
              }}
            />
            <Button
              disabled={
                (attempted &&
                  (answer1 !==
                    RobloxAnswer.find((item) => item.question == question)
                      ?.firstAnswer ||
                    countdown !== 0) &&
                  answer2 === "") ||
                cookies[question]
              }
              variant="contained"
              startIcon={
                answer1 ==
                RobloxAnswer.find((item) => item.question == question)
                  ?.firstAnswer ? (
                  <LockOpenIcon />
                ) : (
                  <LockIcon />
                )
              }
              sx={{
                paddingX: "3rem",
                backgroundColor:
                  answer1 ==
                  RobloxAnswer.find((item) => item.question == question)
                    ?.firstAnswer
                    ? "green"
                    : "blue",
              }}
              onClick={handleUnlock}
            >
              {answer1 !== ""
                ? answer1 ==
                  RobloxAnswer.find((item) => item.question == question)
                    ?.firstAnswer
                  ? "Submit"
                  : attempted
                  ? `${countdown}s`
                  : "Unlock"
                : "Unlock"}
            </Button>
            {cookies[question] ? (
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
