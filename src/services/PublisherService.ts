import { api } from '@/boot/axios';
import type {
  PublisherPageResponse,
  PublisherPayload,
  PublisherResponse,
} from '@/types/Publisher';

interface GetPublishersParams {
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

async function getPublishers(
  params: GetPublishersParams = {},
): Promise<PublisherPageResponse> {
  const response = await api.get<PublisherPageResponse>('/publishers', {
    params,
  });

  return response.data;
}

async function getPublisher(id: number): Promise<PublisherResponse> {
  const response = await api.get<PublisherResponse>(`/publishers/${id}`);

  return response.data;
}

async function createPublisher(
  data: PublisherPayload,
): Promise<PublisherResponse> {
  const response = await api.post<PublisherResponse>('/publishers', data);

  return response.data;
}

async function updatePublisher(
  id: number,
  data: PublisherPayload,
): Promise<PublisherResponse> {
  const response = await api.put<PublisherResponse>(`/publishers/${id}`, data);

  return response.data;
}

async function deletePublisher(id: number): Promise<void> {
  await api.delete<void>(`/publishers/${id}`);
}

export const PublisherService = {
  getPublishers,
  getPublisher,
  createPublisher,
  updatePublisher,
  deletePublisher,
};

export type { GetPublishersParams };
