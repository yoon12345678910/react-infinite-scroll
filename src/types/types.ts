export interface CommentType {
  no: number;
  id: string;
  name: string;
  email: string;
  body: string;
  createdAt: Date;
}

export type CommentApiResponse = {
  data: CommentType[];
  meta: {
    totalRowCount: number;
  };
};
