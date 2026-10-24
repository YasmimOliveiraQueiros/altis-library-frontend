import { api } from '@/boot/axios';
import type { ChangeMyPasswordRequest, PageResponse, UpdateMyProfileRequest, UserResponse} from '@/types/User';

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

    async getMyProfile(): Promise<UserResponse> {
        const response = await api.get<UserResponse>('/users/me');
        return response.data;
    },

    async updateMyProfile(data: UpdateMyProfileRequest): Promise<UserResponse> {
        const response = await api.patch<UserResponse>('/users/me', data);
        return response.data;
    },

    async changeMyPassword(data: ChangeMyPasswordRequest): Promise<void> {
        await api.patch<void>('/users/me/password', data);
    },

    async closeMyAccount(): Promise<void> {
        await api.delete<void>('/users/me');
    },
    
    async updateStatus(id: number, active: boolean):
    Promise<void> {
        await api.patch(`/users/${id}/status`, null, {
            params: { active },
        });
    },
};
