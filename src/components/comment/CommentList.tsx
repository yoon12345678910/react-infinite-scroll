import type { CommentType } from '../../types/types';

import { Comment } from './Comment';

export const CommentList = ({
  isLoading,
  comments,
  setRef,
}: {
  isLoading: boolean;
  comments: CommentType[];
  setRef?: (node: HTMLElement | null) => void;
}) => {
  return (
    <ul className="list-none">
      {comments.map((comment, index) => (
        <Comment
          ref={(ref) => (index === comments.length - 1 ? setRef?.(ref) : undefined)}
          key={comment.id}
          comment={comment}
        />
      ))}
      {isLoading && <li className="px-3 pb-3 text-center">Loading...</li>}
    </ul>
  );
};
