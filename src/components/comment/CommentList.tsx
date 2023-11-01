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
      {comments.map((comment, index) => {
        if (index === comments.length - 1) {
          return <Comment ref={(ref) => setRef?.(ref)} key={comment.id} comment={comment} />;
        }

        return <Comment key={comment.id} comment={comment} />;
      })}
      {isLoading && <li className="px-3 pb-3 text-center">Loading...</li>}
    </ul>
  );
};
