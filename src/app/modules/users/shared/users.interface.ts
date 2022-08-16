export interface User {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
    defaultPassword?: string;
    roleId?: number;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Role {
    id?: number;
    name?: string;
}
