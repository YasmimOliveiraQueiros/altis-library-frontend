import { api } from '@/boot/axios';
import type { DashboardResponse } from '@/types/Dashboard';

async function getDashboard(): Promise<DashboardResponse> {
  const response = await api.get<DashboardResponse>('/dashboard');

  return response.data;
}

export const DashboardService = { getDashboard };
