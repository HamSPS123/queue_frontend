export interface ServiceTypes {
    id: number;
    code: string;
    name: string;
}

export interface Services {
    id: number;
    code: string;
    name: string;
    serviceType: ServiceTypes;
}
