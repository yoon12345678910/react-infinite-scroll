import React from 'react';

import type { CommentType } from '../../types/types';

interface CommentProps {
  comment: CommentType;
}

export const Comment = React.forwardRef(({ comment }: CommentProps, ref: React.ForwardedRef<HTMLLIElement>) => {
  return (
    <li ref={ref} className="p-5 mb-3 bg-gray-200 border border-solid border-gray-400">
      <span>
        [{comment.no}] {comment.email}
      </span>
      <p>{comment.body}</p>
    </li>
  );
});
