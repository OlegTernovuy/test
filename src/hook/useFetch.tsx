import { useState } from 'react';
import { AxiosRequestConfig } from 'axios';

import axios from '../utils/axios';

interface ApiRequestOptions extends AxiosRequestConfig {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

const useFetch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const makeRequest = async (
        config: AxiosRequestConfig,
        { onSuccess, onError }: ApiRequestOptions = {}
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios(config);
            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        } catch (err: any) {
            setError(err.message);
            if (onError) {
                onError(err);
            }
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, makeRequest };
};

export default useFetch;
