export interface UserResponse {
    id: number;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    birthDate: string;
    address: string;
    isAdmin: boolean;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateMyProfileRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ChangeMyPasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}


export interface PageResponse<T> { // T torna a interface genérica: podemos reutilizá-la depois para editoras, livros e aluguéis, sem criar uma interface de paginação para cada recurso
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
