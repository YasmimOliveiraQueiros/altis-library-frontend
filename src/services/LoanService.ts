import { api } from '@/boot/axios';
import type { PageResponse } from '@/types/User';
import type { GetLoansParams, LoanRequest, LoanResponse } from '@/types/Loan';

async function getLoans(params: GetLoansParams = {}): Promise<PageResponse<LoanResponse>> {
  const response = await api.get<PageResponse<LoanResponse>>('/loans', { params });

  return response.data;
}

async function createLoan(payload: LoanRequest): Promise<LoanResponse> {
  const response = await api.post<LoanResponse>('/loans', payload);

  return response.data;
}

async function updateLoan(id: number, payload: LoanRequest): Promise<LoanResponse> {
  const response = await api.put<LoanResponse>(`/loans/${id}`, payload);

  return response.data;
}

async function returnLoan(id: number): Promise<void> {
  await api.patch<void>(`/loans/${id}/return`);
}

export const LoanService = { getLoans, createLoan, updateLoan, returnLoan };
