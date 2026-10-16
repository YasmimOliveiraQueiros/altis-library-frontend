export interface UserResponse {
    id: number;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    birthDate: string;
    adress: string;
    isAdmin: boolean;
    active: boolean;
    createAt: string;
    updateAt: string;
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
