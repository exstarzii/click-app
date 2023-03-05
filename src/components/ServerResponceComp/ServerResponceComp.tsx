import Alert from '@mui/material/Alert';
import React, { FC } from 'react';

interface ServerResponceCompProps {
  serverClicks: Number,
  error:String
}

const ServerResponceComp: FC<ServerResponceCompProps> = (props) => (
  <div>
    {props.error.length == 0 ?
    <Alert severity="warning">По версии сервера {props.serverClicks} раз</Alert>
    :
    <Alert severity="error">Произошла сетевая ошибка <br/>{props.error}</Alert>
  }
  </div>
);

export default ServerResponceComp;
