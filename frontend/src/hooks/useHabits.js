import { useState } from 'react';
import { habitsApi } from '../api/habitsApi';

export const useHabits = () => {
    const [data, setData] = useState({ habits: [], completions: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (month) => {
        setLoading(true);
        setError(null);
        try {
            const dbMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM
            const [habitsRes, completionsRes] = await Promise.all([
                habitsApi.getHabits(),
                habitsApi.getCompletions(dbMonth)
            ]);
            setData({ habits: habitsRes.data, completions: completionsRes.data });
        } catch (err) {
            setError(err.message || 'Failed to fetch habits');
        } finally {
            setLoading(false);
        }
    };

    const mutate = async () => {
        await fetchData();
    };

    return { data, loading, error, mutate, fetchData };
};
