import axios, { AxiosRequestConfig } from 'axios';

const fetchWrapper = async (url: string, options: AxiosRequestConfig = {}) => {
    if (!import.meta.env.VITE_CURRENCY_API_KEY) {
        throw new Error('API key not found');
    }

    try {
        const response = await axios(url, {
            ...options,
            params: {
                api_key: import.meta.env.VITE_CURRENCY_API_KEY,
                ...(options.params || {}),
            },
        });

        return response.data.response;
    } catch (error) {
        console.log(error);
    }
};

export { fetchWrapper };
