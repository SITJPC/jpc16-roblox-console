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
import { Team } from "../../types/team";

function Questions() {
  const [cookies, setCookie] = useCookies(RobloxAnswer.map((el) => el.room));
  const { enqueueSnackbar } = useSnackbar();
  const point = 1000;

  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnser2] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [room, setRoom] = useState(cookies.current);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const selectTeam = useAtomValue(selectedTeam);

  const handleChange = (event: SelectChangeEvent) => {
    setRoom(event.target.value as string);
  };

  const handleSubmitScore = () => {
    console.log(cookies.select);
    cookies.select.map(async (el: Team) => {
      await server
        .post("/operate/score/roblox", {
          teamNo: el.number,
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

    RobloxAnswer.map((el) => {
      setCookie(el.room, false);
    });
    setCookie("score", 0);
    enqueueSnackbar("reset score success!", {
      variant: "success",
    });
    enqueueSnackbar("reset question success!", {
      variant: "success",
    });
  };

  const handleUnlock = async () => {
    if (answer2 != "") {
      if (
        answer2 == RobloxAnswer.find((item) => item.room == room)?.mainAnswer
      ) {
        Swal.fire({
          title: "Answer Correct",
          icon: "success",
        });
        setCookie(room, true);
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
        inputLabel: `Room ${parseInt(room, 10) + 10}`,
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
        text == RobloxAnswer.find((item) => item.room == room)?.unlockAnswer
      ) {
        console.log("correct!");
        Swal.fire({
          title: "Answer Correct",
          icon: "success",
        });
      }
    }
  };
  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  useEffect(() => {
    if (cookies.score == undefined) {
      setCookie("score", 0);
    }
    RobloxAnswer.map((el) => {
      if (cookies[el.room] == undefined) {
        setCookie(el.room, false);
      }
    });
  }, [cookies, setCookie]);

  useEffect(() => {
    setCookie("current", room);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let intervalId: any;

    if (
      answer1 !==
        RobloxAnswer.find((item) => item.room == room)?.unlockAnswer &&
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
  }, [answer1, attempted, countdown, room, setCookie]);

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
        {cookies.select?.map((el: Team) => {
          return (
            <Stack
              direction={"row"}
              alignItems={"center"}
              spacing={2}
              marginRight={"1rem"}
            >
              <Avatar
                alt={el.name}
                key={el.number}
                {...stringAvatar(el.name)}
              />
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
              {`Room ${room}`}
            </Typography>
            <Box sx={{ minWidth: 120, marginLeft: "1.5rem" }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Room</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={room}
                  label="Room"
                  onChange={handleChange}
                >
                  {RobloxAnswer.map((el) => (
                    <MenuItem value={el.room}>Room {el.room}</MenuItem>
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
                  RobloxAnswer.find((item) => item.room == room)
                    ?.unlockAnswer || cookies[room]
              }
              onChange={(el) => {
                setAnser2(el.target.value);
              }}
            />
            <Button
              disabled={
                (attempted &&
                  (answer1 !==
                    RobloxAnswer.find((item) => item.room == room)
                      ?.unlockAnswer ||
                    countdown != 0) &&
                  answer2 == "") ||
                cookies[room]
              }
              variant="contained"
              startIcon={
                answer1 ==
                RobloxAnswer.find((item) => item.room == room)?.unlockAnswer ? (
                  <LockOpenIcon />
                ) : (
                  <LockIcon />
                )
              }
              sx={{
                paddingX: "3rem",
                backgroundColor:
                  answer1 ==
                  RobloxAnswer.find((item) => item.room == room)?.unlockAnswer
                    ? "green"
                    : "blue",
              }}
              onClick={handleUnlock}
            >
              {answer1 !== ""
                ? answer1 ==
                  RobloxAnswer.find((item) => item.room == room)?.unlockAnswer
                  ? "Submit"
                  : attempted
                  ? `${countdown}s`
                  : "Unlock"
                : "Unlock"}
            </Button>
            {cookies[room] ? (
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
