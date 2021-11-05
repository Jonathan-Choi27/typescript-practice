import { Request, Response } from 'express';

import {
  createSession,
  findSessions,
  updateSession,
} from '../service/session.service';
import { validatePassword } from '../service/user.service';
import { signJwt } from '../utils/jwt.utils';

export async function createUserSessionHandler(req: Request, res: Response) {
  // Validate the user's password
  const user = await validatePassword(req.body);

  if (!user) return res.status(401).send('Invalid email or password');

  // Create a session

  // @ts-ignore
  const session = await createSession(user._id, req.get('user-agent') || '');

  // Create an access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: process.env.ACCESS_TOKEN_TTL }
  );

  // Create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: process.env.REFRESH_TOKEN_TTL }
  );

  res.cookie('accessToken', accessToken, {
    maxAge: 900000, // 15 Minutes
    httpOnly: true,
    domain: process.env.COOKIE_DOMAIN,
    path: '/',
    sameSite: 'strict',
    secure: process.env.PRODUCTION,
  });

  res.cookie('refreshToken', refreshToken, {
    maxAge: 3.154e10, // 1 Year
    httpOnly: true,
    domain: process.env.COOKIE_DOMAIN,
    path: '/',
    sameSite: 'strict',
    secure: process.env.PRODUCTION,
  });

  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(_: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

export async function deleteSessionHandler(_: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
