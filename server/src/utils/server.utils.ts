import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import deserializeUser from '../middleware/deserializeUser';

import routes from '../routes';

export default function createServer() {
  const app = express();
  app.use(
    cors({
      origin: process.env.ORIGIN,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(deserializeUser);

  routes(app);

  return app;
}
