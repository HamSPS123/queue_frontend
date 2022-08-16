export interface Type {
    id: number;
    code: string;
    name: string;
}

export interface Services {
    id: number;
    code: string;
    laName: string;
    enName: string;
    type: Type;
}
