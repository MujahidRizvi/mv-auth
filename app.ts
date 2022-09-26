import * as errorHandler from './middlewares/apiErrorHandler';
import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import userRoutes from './routes/user-account.route';
import authRoutes from './routes/auth.route';
import morganMiddleware from './middlewares/morganMiddleware';
import { createClient } from 'redis';
import {
  ALLOW_ORIGIN_1,
  ALLOW_ORIGIN_2,
  ALLOW_ORIGIN_3,
  ALLOW_ORIGIN_4,
  ALLOW_ORIGIN_5,
  ALLOW_ORIGIN_6,
} from './utils/constants';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.json()); // application/json

app.use((req, res, next) => {
  const allowedOrigins = [
    ALLOW_ORIGIN_1,
    ALLOW_ORIGIN_2,
    ALLOW_ORIGIN_3,
    ALLOW_ORIGIN_4,
    ALLOW_ORIGIN_5,
    ALLOW_ORIGIN_6,
  ];

  const origin = req.headers.origin; //origin attached with req headers

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin); //if request is coming outside of container i.e. web domain
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH');
  res.setHeader('Access-Control-Allow-Headers', ['Content-Type, Authorization', 'x-csrf-token']);
  next();
});

const csrfProtection = csrf({
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: parseInt(process.env.COOKIE_EXPIRY), //cookie will expire after one year
  },
});

//conditionally running csrf middleware
app.use((req, res, next) => {
  if (req.query['csrf-bypass']) {
    next();
  } else {
    csrfProtection(req, res, next);
  }
});

// use morgan to write out http calls in logs
app.use(morganMiddleware);

//Set routes
app.use('/auth/', authRoutes);
app.use('/users/', userRoutes);

// Error Handler
app.use(errorHandler.notFoundErrorHandler);
app.use(errorHandler.errorHandler);

// connect with redis

//create redis client
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect();

export { app, redisClient };
