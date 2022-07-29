export interface User {
    id?: number;
    username?: string;
    role_id?: number;
    isActive?: boolean;
    role?: Role;
  }

  export interface Role {
    id: number;
    role_name: string;
}


