import * as process from 'process';
import dotenv from 'dotenv';
export class RestAPI {
    baseURL:string | undefined = process.env.REACT_APP_REST_API_URL;
    async get(endpoint: string): Promise<any> {
        console.log(this.baseURL)
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

export const api = new RestAPI();