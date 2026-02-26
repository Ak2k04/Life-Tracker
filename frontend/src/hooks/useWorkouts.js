import { useState } from 'react';
import { workoutsApi } from '../api/workoutsApi';

export const useWorkouts = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (limit = 20, offset = 0) => {
        setLoading(true);
        setError(null);
        try {
            const res = await workoutsApi.getWorkouts(limit, offset);
            setData(res.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch workouts');
        } finally {
            setLoading(false);
        }
    };

    const mutate = async () => {
        await fetchData();
    };

    return { data, loading, error, mutate, fetchData };
};
