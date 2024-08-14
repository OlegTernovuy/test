import { useState, useCallback } from 'react';

import axios from '../utils/axios';

const useFetchData = <T,>(url: string) => {
    const [data, setData] = useState<T | []>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(url, { withCredentials: true });
            setData(response.data.data);
        } catch (err: any) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [url]);

    return { data, loading, fetchData };
};

export default useFetchData;
