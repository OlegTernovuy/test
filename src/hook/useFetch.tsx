import { useState, useCallback } from 'react';

import axios from '../utils/axios';

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface UseFetchDataOptions {
    method?: RequestMethod;
    body?: any;
}

const useFetchData = <T,>(url: string, options: UseFetchDataOptions = {}) => {
    const [data, setData] = useState<T | []>([]);
    const [loading, setLoading] = useState(false);
    const { method = 'GET' } = options;

    const fetchData = useCallback(
        async (body: any = options.body) => {
            setLoading(true);
            try {
                const response = await axios.request({
                    url,
                    method,
                    data: body,
                    withCredentials: true,
                });
                setData(response.data.data);
            } catch (err: any) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        },
        [url, method, options.body]
    );

    return { data, loading, fetchData };
};

export default useFetchData;
