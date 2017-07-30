import { config } from '../config';

const headers = new Headers({
            'Content-Type': 'application/json',
});

const fetchOptions = (method: 'POST' | 'GET', body?: any): RequestInit => (
    {
        body,
        method,
        headers
    }
);

export const compElFetch = (endpoint: string, method: 'POST' | 'GET', body: any) => {
    return fetch(config.serviceUrl + endpoint, fetchOptions('POST', JSON.stringify(body)));
    
};
