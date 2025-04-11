export interface Post {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
}

export interface PostsResponse {
  content: Post[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
}