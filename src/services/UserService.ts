import { api } from '@/boot/axios';
import type { PageResponse, UserResponse} from '@/types/User';

interface GetUserParams {
    search?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
}

async function getUsers(
    params: GetUserParams = {}): Promise<PageResponse<UserResponse>> {
        const response = await api.get<PageResponse<UserResponse>>('/users', {
            params,
        });

        return response.data;
}

export const UserService = {
    getUsers,
    
    async updateStatus(id: number, active: boolean):
    Promise<void> {
        await api.patch(`/users/${id}/status`, null, {
            params: { active },
        });
    },
};