import mongoose from 'mongoose';
import supertest from 'supertest';

import createServer from '../utils/server.utils';
import * as UserService from '../service/user.service';
import * as SessionService from '../service/session.service';
import { createUserSessionHandler } from '../controller/session.controller';

const app = createServer();

const userPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  email: 'jane.doe@example.com',
  name: 'Jane Doe',
};

const userInput = {
  email: 'test@example.com',
  name: 'Test Test',
  password: 'Password123',
  passwordConfirmation: 'Password123',
};

const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: new mongoose.Types.ObjectId().toString(),
  valid: true,
  userAgent: 'PostmanRuntime/7.28.4',
  createdAt: new Date('2021-10-31T03:55:46.965+00:00'),
  updatedAt: new Date('2021-10-31T03:55:46.965+00:00'),
  __v: 0,
};

describe('user', () => {
  describe('user registration', () => {
    describe('given the username and password are valid', () => {
      it('should return the user payload', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')

          // @ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await supertest(app)
          .post('/api/users')
          .send(userInput);

        expect(statusCode).toBe(200);
        expect(body).toEqual(userPayload);

        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });

    describe('given the passwords do not match', () => {
      it('should return a 400', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')

          // @ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode } = await supertest(app)
          .post('/api/users')
          .send({ ...userInput, passwordConfirmation: 'does not match' });

        expect(statusCode).toBe(400);

        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    describe('given the user service throws', () => {
      it('should return a 409 error', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          .mockRejectedValue('oh no :(');

        const { statusCode } = await supertest(app)
          .post('/api/users')
          .send(userInput);

        expect(statusCode).toBe(409);

        expect(createUserServiceMock).toHaveBeenCalled();
      });
    });
  });

  describe('create user session', () => {
    describe('given the username and password are valid', () => {
      it('should return a signed accessToken & refreshToken', async () => {
        jest
          .spyOn(UserService, 'validatePassword')
          // @ts-ignore
          .mockReturnValue(userPayload);

        jest
          .spyOn(SessionService, 'createSession')
          // @ts-ignore
          .mockReturnValue(sessionPayload);

        const req = {
          get: () => {
            return 'a user agent';
          },
          body: {
            email: 'test@example.com',
            password: 'password123',
          },
        };

        const send = jest.fn();

        const res = {
          send,
        };

        // @ts-ignore
        await createUserSessionHandler(req, res);

        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });
  });
});
