import React, { FC, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { amber } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import ServerResponceComp from "../ServerResponceComp/ServerResponceComp.tsx";
import LoadingButton from "@mui/lab/LoadingButton";

interface MainCompProps {}
let token;
fetch(process.env.REACT_APP_API_KEY + "/api/get_authtoken", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-ZONT-Client": "exstarzii@yandex.ru",
    Authorization: "Basic " + process.env.SECRET,
  },
})
  .then((response) => response.json())
  .then((res) => {
    token = res.token;
  });

const useSendClicks = (clicks, resolve, reject) => {
  useEffect(() => {
    let timer = setTimeout(() => {
      resolve(null);
      fetch(process.env.REACT_APP_API_KEY + "/api/button_count", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-ZONT-Client": "exstarzii@yandex.ru",
          "X-ZONT-Token": token,
        },
        body: JSON.stringify({
          count: clicks,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.count != undefined) {
            resolve(res.count);
          } else {
            reject(res);
          }
        })
        .catch(reject);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [clicks]);
};

const MainComp: FC<MainCompProps> = () => {
  const [serverClicks, setServerClicks] = React.useState(0);
  const [clicks, setClicks] = useState(0);
  const [error, setError] = useState("");
  const [disableButton, setDisableButton] = React.useState(false);

  useSendClicks(
    clicks,
    (count) => {
      if (count == null) {
        setDisableButton(true);
      } else {
        setServerClicks(count);
        setDisableButton(false);
      }
    },
    (error) => {
      setDisableButton(false);
      setError(error.message || error.error_ui);
    }
  );

  const ColorButton = styled(LoadingButton)(({ theme }) => ({
    fontSize: 16,
    backgroundColor: amber[500],
    "&:hover": {
      backgroundColor: amber[700],
    },
    color: theme.palette.getContrastText(amber[500]),
  }));

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{
          height: "100vh",
        }}
      >
        <Paper elevation={3} sx={{ padding: "20px" }}>
          <Stack sx={{ width: "100%" }} spacing={2}>
            <ColorButton
              loading={disableButton}
              variant="contained"
              size="large"
              onClick={() => {
                setClicks(clicks + 1);
              }}
              fullWidth
            >
              Кликнуть
            </ColorButton>
            <Alert severity="info">Кликнули {clicks} раз</Alert>
            <ServerResponceComp serverClicks={serverClicks} error={error} />
          </Stack>
        </Paper>
      </Grid>
    </div>
  );
};

export default MainComp;
