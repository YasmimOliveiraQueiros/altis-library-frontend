import type { LoanResponse } from '@/types/Loan';

export interface DashboardResponse {
  totalUsers: number;
  totalBooks: number;
  totalPublishers: number;
  activeLoans: number;
  overdueLoans: number;
  returnedLoans: number;
  pendingLoans: number;
  latestLoans: LoanResponse[];
  loansByMonth: { year: number; month: number; quantity: number }[];
  booksByStatus: { available: number; rented: number };
}
