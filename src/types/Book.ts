export type BookStatus = 'AVAILABLE' | 'RENTED';
export type BookSortField = 'id' | 'title' | 'author' | 'quantity' | 'status';
export type SortDirection = 'ASC' | 'DESC';

export interface BookResponse {
  id: number;
  title: string;
  author: string;
  publisherId: number;
  quantity: number;
  status: BookStatus;
  observations: string | null;
}

export interface BookPayload {
  title: string;
  author: string;
  publisherId: number;
  quantity: number;
  observations?: string | null;
}

export interface GetBooksParams {
  search?: string;
  page?: number;
  size?: number;
  sortBy?: BookSortField;
  sortDirection?: SortDirection;
}
