export interface User{
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
}

export interface Role{
    code?: string;
    name?: string;
}
