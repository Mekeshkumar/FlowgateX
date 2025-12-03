import { useState, useCallback } from 'react';

const useApi = (apiFunc) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const execute = useCallback(
        async (...args) => {
            try {
                setIsLoading(true);
                setError(null);
                const result = await apiFunc(...args);
                setData(result);
                return { success: true, data: result };
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message;
                setError(errorMessage);
                return { success: false, error: errorMessage };
            } finally {
                setIsLoading(false);
            }
        },
        [apiFunc]
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return {
        data,
        error,
        isLoading,
        execute,
        reset,
    };
};

export default useApi;
