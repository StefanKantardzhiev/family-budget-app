import * as process from 'process';
const baseUrL = process.env.REACT_APP_REST_API_URL;

export class RestAPI {
    async get(endpoint: string): Promise<any> {
        const response = await fetch(`${baseUrL}${endpoint}`,{
            method: 'GET',
            headers:{
                'token': localStorage.getItem('token') || '',
                'Content-Type': 'application/json'
            }
    });
        return response.json();
    }

    async post(endpoint: string, body: any): Promise<any> {
        return await fetch(`${baseUrL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    async put(endpoint: string, body: any): Promise<any> {
        const response = await fetch(`${baseUrL}${endpoint}`, {
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
            const response = await fetch(`${baseUrL}${endpoint}`, {
                method: 'DELETE',
                headers:{
                    'token': localStorage.getItem('token') || '',
                    'Content-Type': 'application/json',
                }
            });
            return response;
    }

    // Similarly, you can add PUT, DELETE methods etc.
}
export const api = new RestAPI();

// Usage