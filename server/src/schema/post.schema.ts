import { object, string, TypeOf } from 'zod';

export type CreatePostInput = TypeOf<typeof createPostSchema>;
export type ReadPostInput = TypeOf<typeof readPostSchema>;
export type UpdatePostInput = TypeOf<typeof updatePostSchema>;
export type DeletePostInput = TypeOf<typeof deletePostSchema>;

const payload = {
  body: object({
    title: string({
      required_error: 'Title is required',
    }),
    description: string({
      required_error: 'Description is required',
    }).min(50, 'Description should be at least 50 characters long'),
    image: string({
      required_error: 'Image is required',
    }),
  }),
};

const params = {
  params: object({
    postId: string({
      required_error: 'postId is required',
    }),
  }),
};

export const createPostSchema = object({
  ...payload,
});

export const updatePostSchema = object({
  ...payload,
  ...params,
});

export const deletePostSchema = object({
  ...params,
});

export const readPostSchema = object({
  ...params,
});
