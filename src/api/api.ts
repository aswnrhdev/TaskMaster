// import Api from "./axiosConfig";
// import axios, { AxiosError, AxiosResponse } from "axios";

// interface SignUp {
//     name: string;
//     email: string;
//     password: string;
// }

// interface Login {
//     email: string;
//     password: string;
// }

// interface AuthResponse {
//     success: boolean;
//     data?: {
//         userId: string | undefined;
//         _id?: string;
//         name?: string;
//         email?: string;
//         createdAt?: Date;
//     };
//     error?: string;
//     status?: number;
// }

// interface ApiErrorResponse {
//     error?: string;
//     message?: string;
// }

// const handleApiResponse = (response: AxiosResponse): AuthResponse => {
//     return {
//         success: true,
//         data: response.data,
//         status: response.status
//     };
// };

// const handleApiError = (error: unknown): AuthResponse => {
//     if (axios.isAxiosError(error)) {
//         const axiosError = error as AxiosError<ApiErrorResponse>;
//         return {
//             success: false,
//             error: axiosError.response?.data?.error || axiosError.response?.data?.message || axiosError.message,
//             status: axiosError.response?.status
//         };
//     } else {
//         console.error('Unexpected error:', error);
//         return {
//             success: false,
//             error: 'An unexpected error occurred'
//         };
//     }
// };

// export const signup = async (body: SignUp): Promise<AuthResponse> => {
//     return Api.post('/register', body)
//         .then(handleApiResponse)
//         .catch(handleApiError)
// }

// export const login = async (body: Login): Promise<AuthResponse> => {
//     return Api.post('/login', body)
//         .then(handleApiResponse)
//         .catch(handleApiError);
// };



import Api from "./axiosConfig";
import axios, { AxiosError, AxiosResponse } from "axios";

interface SignUp {
    name: string;
    email: string;
    password: string;
}

interface Login {
    email: string;
    password: string;
}

interface AuthResponse {
    success: boolean;
    data?: {
        userId: string | undefined;
        _id?: string;
        name?: string;
        email?: string;
        createdAt?: Date;
        token?: string;  // Add this line to include the token in the response
    };
    error?: string;
    status?: number;
}

interface ApiErrorResponse {
    error?: string;
    message?: string;
}

const handleApiResponse = (response: AxiosResponse): AuthResponse => {
    return {
        success: true,
        data: response.data,
        status: response.status
    };
};

const handleApiError = (error: unknown): AuthResponse => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        return {
            success: false,
            error: axiosError.response?.data?.error || axiosError.response?.data?.message || axiosError.message,
            status: axiosError.response?.status
        };
    } else {
        console.error('Unexpected error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred'
        };
    }
};

export const signup = async (body: SignUp): Promise<AuthResponse> => {
    return Api.post('/register', body)
        .then(handleApiResponse)
        .catch(handleApiError)
}

export const login = async (body: Login): Promise<AuthResponse> => {
    return Api.post('/login', body)
        .then((response) => {
            const authResponse = handleApiResponse(response);
            // If login is successful and we receive a token, store it
            if (authResponse.success && authResponse.data?.token) {
                localStorage.setItem('userToken', authResponse.data.token);
            }
            return authResponse;
        })
        .catch(handleApiError);
};

// You may want to add a logout function to clear the token
export const logout = () => {
    localStorage.removeItem('userToken');
};
