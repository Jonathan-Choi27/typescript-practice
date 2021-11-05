import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import createServer from '../utils/server.utils';
import { createPost } from '../service/post.service';
import { signJwt } from '../utils/jwt.utils';

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

export const postPayload = {
  user: userId,
  title: 'A New Post',
  description: 'Some post description',
  image: 'https://i.imgur.com/QlRphfQ.jpg',
};

export const userPayload = {
  _id: userId,
  email: 'test@example.com',
  name: 'Test test',
};

describe('post', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('get post route', () => {
    describe('given the post does not exist', () => {
      it('should return a 404', async () => {
        const postId = 'post_123';

        await supertest(app).get(`/api/posts/${postId}`).expect(404);
      });
    });

    describe('given the post does exist', () => {
      it('should return a 200 status and the post', async () => {
        // @ts-ignore
        const post = await createPost(postPayload);

        const { body, statusCode } = await supertest(app).get(
          `/api/posts/${post.postId}`
        );

        expect(statusCode).toBe(200);
        expect(body.postId).toBe(post.postId);
      });
    });
  });

  describe('create post route', () => {
    describe('given the user is not logged in', () => {
      it('should return a 403', async () => {
        const { statusCode } = await supertest(app).post('/api/posts');

        expect(statusCode).toBe(403);
      });
    });

    describe('given the user is logged in', () => {
      it('should return a 200 and create the post', async () => {
        const jwt = signJwt(userPayload);

        const { statusCode, body } = await supertest(app)
          .post('/api/posts')
          .set('Authorization', `Bearer ${jwt}`)
          .send(postPayload);

        expect(statusCode).toBe(200);

        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          description: 'Some post description',
          image: 'https://i.imgur.com/QlRphfQ.jpg',
          postId: expect.any(String),
          title: 'A New Post',
          updatedAt: expect.any(String),
          user: expect.any(String),
        });
      });
    });
  });
});
