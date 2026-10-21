import { api } from '@/boot/axios';
import type { PageResponse } from '@/types/User';
import type { BookPayload, BookResponse, GetBooksParams } from '@/types/Book';

async function getBooks(
  params: GetBooksParams = {},
): Promise<PageResponse<BookResponse>> {
  const response = await api.get<PageResponse<BookResponse>>('/books', {
    params,
  });

  return response.data;
}

async function getBook(id: number): Promise<BookResponse> {
  const response = await api.get<BookResponse>(`/books/${id}`);

  return response.data;
}

async function createBook(data: BookPayload): Promise<BookResponse> {
  const response = await api.post<BookResponse>('/books', data);

  return response.data;
}

async function updateBook(id: number, data: BookPayload): Promise<BookResponse> {
  const response = await api.put<BookResponse>(`/books/${id}`, data);

  return response.data;
}

async function deleteBook(id: number): Promise<void> {
  await api.delete<void>(`/books/${id}`);
}

export const BookService = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
