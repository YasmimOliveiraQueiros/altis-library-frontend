export type PublisherStatus = 'ACTIVE' | 'INACTIVE';

export interface PublisherResponse {
  id: number;
  name: string;
  email: string;
  cnpj: string;
  city: string;
  state: string;
  bookCount: number;
  status: PublisherStatus;
}

export interface PublisherPayload {
  name: string;
  email: string;
  cnpj: string;
  city: string;
  state: string;
}

export interface PublisherPageResponse {
  content: PublisherResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
