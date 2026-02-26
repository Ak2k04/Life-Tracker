import { useState } from 'react';
import { financeApi } from '../api/financeApi';

export const useFinance = () => {
    const [data, setData] = useState({ income: [], expenses: [], summary: null });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [incomeRes, expenseRes, summaryRes] = await Promise.all([
                financeApi.getIncome(),
                financeApi.getExpenses(),
                financeApi.getSummary()
            ]);
            setData({
                income: incomeRes.data,
                expenses: expenseRes.data,
                summary: summaryRes.data
            });
        } catch (err) {
            setError(err.message || 'Failed to fetch finance data');
        } finally {
            setLoading(false);
        }
    };

    const mutate = async () => {
        await fetchData();
    };

    return { data, loading, error, mutate, fetchData };
};
