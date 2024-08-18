import process from 'process';

export class RestAPI {
    baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    async get(endpoint: string): Promise<any> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'GET',
            headers: {
                'token': localStorage.getItem('token') || '',
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    }

    async post(endpoint: string, body: any): Promise<any> {
        return await fetch(`${this.baseURL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    async put(endpoint: string, body: any): Promise<any> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token') || '',
            },
            body: JSON.stringify(body)
        });
        return response.json();
    }

    async delete(endpoint: string): Promise<any> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'token': localStorage.getItem('token') || '',
                'Content-Type': 'application/json',
            }
        });
        return response;
    }
}

export const api = new RestAPI(`${process.env.REACT_APP_REST_API_URL}`);