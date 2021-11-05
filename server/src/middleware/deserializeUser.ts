import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';

import { reIssueAccessToken } from '../service/session.service';
import { verifyJwt } from '../utils/jwt.utils';

export default async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken =
    get(req, 'cookies.accessToken') ||
    get(req, 'headers.authorization', '').replace(/^Bearer\s/, '');

  const refreshToken =
    get(req, 'cookies.accessToken') || get(req, 'headers.x-refresh');

  if (!accessToken) return next();

  const { decoded, expired } = verifyJwt(accessToken);
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);

      res.cookie('accessToken', newAccessToken, {
        maxAge: 900000, // 15 Minutes
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
        path: '/',
        sameSite: 'strict',
        secure: process.env.PRODUCTION,
      });
    }

    const result = verifyJwt(newAccessToken as string);

    res.locals.user = result.decoded;
    return next();
  }

  return next();
}