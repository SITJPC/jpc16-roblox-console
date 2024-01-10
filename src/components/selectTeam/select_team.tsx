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
  Button,
} from "@mui/material";
import server from "../../utils/server";
import { Group, GroupPlayerResponse } from "../../types/team";
import { atom, useAtom } from "jotai";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
export const selectedTeam = atom<Group[]>([]);

const SelectTeam = () => {
  const [groupPlayer, setGroupPlayer] = useState<Group[]>([]);
  const [team, setTeam] = useAtom(selectedTeam);
  const [error, setError] = useState("");

  const [cookies, setCookie] = useCookies(["select-team"]);
  const navigate = useNavigate();

  const getGroupPlayer = async () => {
    await server.get<GroupPlayerResponse>("/operate/player").then((res) => {
      if (res.data.success) {
        setGroupPlayer(res.data.data);
      }
    });
  };

  const handleClickCard = (data: Group) => {
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

  useEffect(() => {
    getGroupPlayer();
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
          <Grid container justifyContent="center" spacing={2}>
            {groupPlayer?.map((value) => (
              <Grid key={value.number} item>
                <Card
                  sx={{
                    width: 345,
                    height: 360,
                    border: team.includes(value) ? "4px solid green" : "",
                  }}
                >
                  <CardActionArea onClick={() => handleClickCard(value)}>
                    <CardMedia
                      component="img"
                      height="270"
                      image="test.png"
                      alt="green iguana"
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
