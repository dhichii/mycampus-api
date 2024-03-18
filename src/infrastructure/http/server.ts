import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {errorMiddleware} from '../../Interface/http/middleware/error';
import {universitasRouter} from '../../Interface/http/api/universitas/router';
import {sekolahRouter} from '../../Interface/http/api/sekolah/router';

export const initServer = () => {
  const app = express();

  app.get('/api/v1', function(req, res) {
    res.status(200).json({message: 'Welcome to MyCampus API'});
  });

  app.use(bodyParser.json(), cookieParser());

  app.use('/api/v1/images', express.static('public'));
  app.use('/api/v1', universitasRouter(), sekolahRouter());
  app.use(errorMiddleware);

  return app;
};
