export type LoanStatus = 'PENDING' | 'OVERDUE' | 'RETURNED' | 'RETURNED_LATE';
export type SortDirection = 'ASC' | 'DESC';

export interface LoanResponse {
  id: number;
  userId: number;
  bookId: number;
  bookTitle: string;
  loanDate: string;
  returnDate: string;
  returnedAt: string | null;
  status: LoanStatus;
  observations: string | null;
}

export interface LoanRequest {
  userId: number;
  bookId: number;
  loanDate: string;
  returnDate: string;
  observations: string | null;
}

export interface GetLoansParams {
  name?: string;
  status?: LoanStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}
