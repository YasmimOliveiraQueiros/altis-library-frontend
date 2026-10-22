export interface DashboardResponse {
  totalUsers: number;
  totalBooks: number;
  totalPublishers: number;
  activeLoans: number;
  overdueLoans: number;
  returnedLoans: number;
  pendingLoans: number;
  latestLoans: unknown[];
}
