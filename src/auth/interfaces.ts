export interface ISignUpRequest{
    email: string;
    password: string;
    name: string;
    surname: string;
    phone?: string;
}

export interface ISignInRequest{
    email: string
    password: string
}

export interface ISignInResponse{
    token: string;
    user: {
        name: string;
    }
}