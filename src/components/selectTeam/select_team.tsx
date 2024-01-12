import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Stack,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Grid,
} from "@mui/material";
import server from "../../utils/server";
import { atom, useAtom } from "jotai";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Team, TeamPlayerResponse } from "../../types/team";
export const selectedTeam = atom<Team[]>([]);

const SelectTeam = () => {
  const [teamPlayer, setTeamPlayer] = useState<Team[]>([]);
  const [team, setTeam] = useAtom(selectedTeam);
  const [error, setError] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie] = useCookies(["select", "current"]);
  const navigate = useNavigate();

  const getGroupPlayer = async () => {
    await server.get<TeamPlayerResponse>("/operate/player").then((res) => {
      if (res.data.success) {
        setTeamPlayer(res.data.data);
      }
    });
  };

  const handleClickCard = (data: Team) => {
    setTeam((prevTeam) =>
      prevTeam.includes(data)
        ? prevTeam.filter((member) => member !== data)
        : [...prevTeam, data]
    );
  };

  const SubmitTeam = () => {
    if (team.length != 0) {
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        iconColor: "red",
        showConfirmButton: true,
        confirmButtonColor: "#FF7878",
        confirmButtonText: "OK",
        cancelButtonColor: "#9A9A9A",
        cancelButtonText: "Cancel",
        showCancelButton: true,
        reverseButtons: true,
        html: `<b>Your Teams<b/> : ${team.map((a) => {
          return `<span style="color: red"> ${a.name} </span> `;
        })}`,
      }).then((result) => {
        if (result.isConfirmed) {
          setCookie("select", team);
          navigate("/question");
        }
      });
    } else {
      setError("Please add team before submit");
    }
  };
  console.log(team.map((el) => el.number));
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
        height: "17rem",
      },
      children: (
        <Stack
          height={"100%"}
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography fontSize={"5rem"} fontWeight={"bold"}>
            {name.split(" ")[0][0]}
            {name.split(" ")[1][0]}
          </Typography>
        </Stack>
      ),
    };
  }

  useEffect(() => {
    getGroupPlayer();
    setCookie("current", 1);
  }, []);

  return (
    <Box width="100vw" height="100vh">
      <Container maxWidth="lg" sx={{ height: "100%" }}>
        <Stack
          justifyContent="center"
          width="100%"
          height="100%"
          alignItems="center"
        >
          <Typography
            color={"black"}
            fontWeight={"bold"}
            fontSize={"5rem"}
            marginBottom={"2rem"}
          >
            Select Your Team
          </Typography>
          <Box
            sx={{
              overflowY: teamPlayer.length > 6 ? "auto" : "hidden",
              maxHeight: teamPlayer.length > 6 ? "80vh" : "inherit",
            }}
          >
            <Grid container justifyContent="center" spacing={2}>
              {teamPlayer?.map((value) => (
                <Grid key={value.number} item>
                  <Card
                    sx={{
                      width: 345,
                      height: 360,
                      border: team.includes(value) ? "4px solid darkblue" : "",
                    }}
                  >
                    <CardActionArea onClick={() => handleClickCard(value)}>
                      <CardMedia
                        component="text"
                        height="970"
                        {...stringAvatar(value.name)}
                      />
                      <CardContent>
                        <Stack alignItems="center">
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            fontWeight="bold"
                            textAlign="center"
                          >
                            {value.name}
                          </Typography>
                          <Typography color="blue" variant="caption">
                            JPC16
                          </Typography>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box
            onClick={SubmitTeam}
            sx={{
              backgroundColor: "blue",
              padding: "1rem 3rem",
              borderRadius: "1rem",
              marginY: "3rem",
              cursor: "pointer",
              transition: "background-color 0.3s",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
              "&:hover": {
                backgroundColor: "darkblue",
              },
            }}
          >
            <Typography color={"white"} fontWeight={"bold"}>
              Submit Team Members
            </Typography>
          </Box>
          <Typography color={"red"}>{error}</Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default SelectTeam;
