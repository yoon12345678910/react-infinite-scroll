import { faker } from '@faker-js/faker';

import type { CommentType, CommentApiResponse } from '../types/types';

const newComment = (index: number): CommentType => {
  return {
    no: index + 1,
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    body: faker.lorem.lines({ min: 2, max: 4 }),
    createdAt: faker.date.anytime(),
  };
};

export function makeData(len: number) {
  return [...new Array(len)].map((_, index): CommentType => {
    return {
      ...newComment(index),
    };
  });
}

const data = makeData(1000);

export const fetchData = (start: number, size: number): Promise<CommentApiResponse> => {
  const dbData = [...data];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: dbData.slice(start, start + size),
        meta: {
          totalRowCount: dbData.length,
        },
      });
    }, 500);
  });
};
