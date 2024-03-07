import express from 'express';
import {errorMiddleware} from '../../Interface/http/middleware/error';
import {universitasRouter} from '../../Interface/http/api/universitas/router';

export const initServer = () => {
  const app = express();
  app.get('/api/v1', function(req, res) {
    res.status(200).json({message: 'Welcome to MyCampus API'});
  });
  app.use('/api/v1', universitasRouter());
  app.use(errorMiddleware);

  return app;
};
