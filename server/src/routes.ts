import { Express, Request, Response } from 'express';

import {
  createUserHandler,
  getCurrentUserHandler,
} from './controller/user.controller';
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from './controller/session.controller';
import {
  createPostHandler,
  deletePostHandler,
  readPostHandler,
  updatePostHandler,
} from './controller/post.controller';
import {
  createPostSchema,
  deletePostSchema,
  readPostSchema,
  updatePostSchema,
} from './schema/post.schema';

import { createUserSchema } from './schema/user.schema';
import { createSessionSchema } from './schema/session.schema';

import validate from './middleware/validateResource';
import requireUser from './middleware/requireUser';

export default function routes(app: Express) {
  // Health Check
  app.get('/healthcheck', (_: Request, res: Response) => res.sendStatus(200));

  // Users
  app.post('/api/users', validate(createUserSchema), createUserHandler);
  app.get('/api/me', requireUser, getCurrentUserHandler);

  // Sessions
  app.post(
    '/api/sessions',
    validate(createSessionSchema),
    createUserSessionHandler
  );
  app.get('/api/sessions', requireUser, getUserSessionsHandler);
  app.delete('/api/sessions', requireUser, deleteSessionHandler);

  // Posts
  app.post(
    '/api/posts',
    requireUser,
    validate(createPostSchema),
    createPostHandler
  );
  app.put(
    '/api/posts/:postId',
    requireUser,
    validate(updatePostSchema),
    updatePostHandler
  );
  app.get('/api/posts/:postId', validate(readPostSchema), readPostHandler);
  app.delete(
    '/api/posts/:postId',
    requireUser,
    validate(deletePostSchema),
    deletePostHandler
  );
}
