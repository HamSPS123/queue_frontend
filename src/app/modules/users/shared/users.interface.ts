export interface User {
    code: string;
    firstName: string;
    lastName: string;
    role: Role;
    defaultPassword: string;
    roleId: number;
    id: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Role {
    id: number;
    name: string;
}
