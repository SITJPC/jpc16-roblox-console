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
  Avatar,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import LockIcon from "@mui/icons-material/Lock";
import { RobloxAnswer } from "../../data/answer";
import { useCookies } from "react-cookie";
import { useAtomValue } from "jotai";
import { selectedTeam } from "../selectTeam/select_team";
import server from "../../utils/server";
import { useSnackbar } from "notistack";
import { Group } from "../../types/team";

function Questions() {
  const [cookies, setCookie] = useCookies(
    RobloxAnswer.map((el) => el.question)
  );
  const { enqueueSnackbar } = useSnackbar();
  const point = 100;

  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnser2] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [question, setQuestion] = useState(cookies.current);
  const selectTeam = useAtomValue(selectedTeam);

  const handleChange = (event: SelectChangeEvent) => {
    setQuestion(event.target.value as string);
  };

  const handleSubmitScore = () => {
    console.log(cookies.select);
    cookies.select.map(async (el: Group) => {
      await server
        .post("/operate/score/roblox", {
          groupNo: el.number,
          score: cookies.score,
        })
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar(`Update score for ${el.name} successfully`, {
              variant: "success",
            });
            console.log("Update score successfully");
          }
        })
        .catch((error) => {
          enqueueSnackbar(`Error updating score for ${el.name} `, {
            variant: "error",
          });
          console.error("Error updating score:", error);
        });
    });
  };

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
        setCookie("score", cookies.score + point);
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
    if (cookies.score == undefined) {
      setCookie("score", 0);
    }
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
      <Stack
        position={"absolute"}
        direction={"row"}
        right={"10rem"}
        top="5rem"
        alignItems={"center"}
      >
        <Stack direction={"row"} marginRight={"2rem"}>
          <StarIcon
            sx={{
              color: "#FFBE00",
              fontSize: "4.5rem",
              position: "absolute",
              left: "-1.5rem",
              top: "-1rem",
            }}
          />
          <Box
            sx={{
              backgroundColor: "#3F4D4F",
              padding: "0.5rem 3rem",
              borderRadius: "2rem",
            }}
          >
            <Typography color={"white"}>
              Score:{" "}
              <span style={{ color: "#FFBE00", fontWeight: "bold" }}>
                {cookies.score}
              </span>
            </Typography>
          </Box>
        </Stack>
        {cookies.select?.map((el: Group) => {
          return (
            <Stack
              direction={"row"}
              alignItems={"center"}
              spacing={2}
              marginRight={"1rem"}
            >
              <Avatar alt={el.name} src="test.png" key={el.number} />
              <Typography color={"black"}>{el.name}</Typography>
            </Stack>
          );
        })}

        <Button variant="contained" onClick={handleSubmitScore}>
          <Typography color={"white"}>Submit Score</Typography>
        </Button>
      </Stack>
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
                    countdown != 0) &&
                  answer2 == "") ||
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

export default Questions;
