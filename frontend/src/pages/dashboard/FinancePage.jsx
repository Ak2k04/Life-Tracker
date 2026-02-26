import React, { useState, useEffect } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { financeApi } from '../../api/financeApi';
import { Plus, TrendingUp, TrendingDown, DollarSign, Edit2, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Rental', 'Gift', 'Bonus', 'Other'];
const EXPENSE_CATEGORIES = ['Housing', 'Food', 'Transport', 'Health', 'Entertainment', 'Shopping', 'Utilities', 'Education', 'Other'];
const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Other'];

const FinancePage = () => {
    const { data: { income, expenses, summary }, fetchData } = useFinance();
    const [activeTab, setActiveTab] = useState('expenses'); // 'income' | 'expenses'
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        entry_date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        customCategory: '',
        source: '', // for income
        description: '', // for expense
        payment_method: 'Credit Card', // for expense
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({
            entry_date: new Date().toISOString().split('T')[0],
            amount: '',
            category: activeTab === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
            customCategory: '',
            source: '',
            description: '',
            payment_method: PAYMENT_METHODS[0],
            notes: ''
        });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setShowForm(false);
        resetForm();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, amount: parseFloat(formData.amount) };
            if (payload.category === 'Other' && payload.customCategory.trim()) {
                payload.category = payload.customCategory.trim();
            }
            if (activeTab === 'income') {
                await financeApi.addIncome(payload);
            } else {
                await financeApi.addExpense(payload);
            }
            setShowForm(false);
            resetForm();
            fetchData();
        } catch (err) {
            alert("Failed to save entry");
        }
    };

    const handleDelete = async (id, type) => {
        if (window.confirm(`Delete this ${type} entry?`)) {
            if (type === 'income') await financeApi.deleteIncome(id);
            else await financeApi.deleteExpense(id);
            fetchData();
        }
    };

    // Safe parsing values for charts
    const balance = (summary?.totalIncome || 0) - (summary?.totalExpenses || 0);
    const PIE_COLORS = ['#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#6366f1', '#14b8a6', '#f43f5e', '#64748b'];

    const expensePieData = summary?.expensesByCategory
        ? Object.entries(summary.expensesByCategory).map(([name, value]) => ({ name, value }))
        : [];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Hero Balance Card */}
            <Card className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white border-0">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-indigo-200 font-medium mb-1">Total Balance</h3>
                        <div className={`text-4xl md:text-5xl font-bold ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                            ₹{balance.toFixed(2)}
                        </div>
                    </div>
                    <div className="flex gap-4 sm:gap-8 bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                        <div>
                            <div className="flex items-center gap-1 text-green-400 text-sm font-medium mb-1">
                                <TrendingUp className="w-4 h-4" /> Income
                            </div>
                            <div className="text-xl font-bold">₹{summary?.totalIncome?.toFixed(2) || '0.00'}</div>
                        </div>
                        <div className="w-px bg-white/20"></div>
                        <div>
                            <div className="flex items-center gap-1 text-red-400 text-sm font-medium mb-1">
                                <TrendingDown className="w-4 h-4" /> Expenses
                            </div>
                            <div className="text-xl font-bold">₹{summary?.totalExpenses?.toFixed(2) || '0.00'}</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Two-Tab Interface */}
            <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
                <button
                    className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'expenses' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    onClick={() => handleTabChange('expenses')}
                >
                    Expenses
                </button>
                <button
                    className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'income' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    onClick={() => handleTabChange('income')}
                >
                    Income
                </button>
            </div>

            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 capitalize">Recent {activeTab}</h3>
                <Button onClick={() => { setShowForm(!showForm); resetForm(); }} size="sm" className="flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add {activeTab === 'income' ? 'Income' : 'Expense'}
                </Button>
            </div>

            {showForm && (
                <Card className="bg-gray-50 dark:bg-gray-800/50 border-indigo-100 dark:border-indigo-800/30 ring-1 ring-indigo-500/10">
                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input label="Date" type="date" value={formData.entry_date} onChange={e => setFormData({ ...formData, entry_date: e.target.value })} required />
                        <Input label="Amount (₹)" type="number" step="0.01" min="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required placeholder="0.00" />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                {!formData.category && <option value="" disabled>Select Category</option>}
                                {(activeTab === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {formData.category === 'Other' && (
                            <Input label="Custom Category" value={formData.customCategory} onChange={e => setFormData({ ...formData, customCategory: e.target.value })} required placeholder="Enter category name" />
                        )}

                        {activeTab === 'income' ? (
                            <Input label="Source" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} required placeholder="e.g. Acme Corp" />
                        ) : (
                            <>
                                <Input label="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required placeholder="e.g. Groceries" />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                                        value={formData.payment_method} onChange={e => setFormData({ ...formData, payment_method: e.target.value })}>
                                        {PAYMENT_METHODS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </>
                        )}

                        <div className={`lg:col-span-${activeTab === 'income' ? '4' : '3'}`}>
                            <Input label="Notes (Optional)" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="Additional details..." />
                        </div>

                        <div className="lg:col-span-4 flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                            <Button type="submit">Save {activeTab}</Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Table view */}
            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{activeTab === 'income' ? 'Source' : 'Description'}</th>
                                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {(activeTab === 'income' ? income : expenses).map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{new Date(item.entry_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{activeTab === 'income' ? item.source : item.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap font-semibold ${activeTab === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                        {activeTab === 'income' ? '+' : ''}₹{Number(item.amount).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-3 pr-2">
                                            <button onClick={() => handleDelete(item.id, activeTab)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(activeTab === 'income' ? income : expenses).length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No {activeTab} recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Charts Panel */}
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mt-10 mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">Financial Overview</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                <Card className="h-80 flex flex-col">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Cash Flow (Last 6 Months)</h4>
                    <div className="flex-1 w-full min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={summary?.monthlyTrend || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip cursor={{ fill: '#374151', opacity: 0.1 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1f2937', color: '#f3f4f6' }} />
                                <Legend iconType="circle" />
                                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="h-80 flex flex-col">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Expenses by Category</h4>
                    <div className="flex-1 w-full min-h-[200px] flex items-center justify-center">
                        {expensePieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={expensePieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                                        {expensePieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1f2937', color: '#f3f4f6' }} />
                                    <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-gray-400 dark:text-gray-500 text-sm">No expense data available</div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default FinancePage;
