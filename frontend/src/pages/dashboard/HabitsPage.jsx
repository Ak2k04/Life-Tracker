import React, { useEffect, useState, useMemo } from 'react';
import { useHabits } from '../../hooks/useHabits';
import { useTheme } from '../../context/ThemeContext';
import { habitsApi } from '../../api/habitsApi';
import { Plus, Settings2, Trash2, Edit2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const COLORS = ['#4f46e5', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];
const DAYS_IN_MONTH = 31;

const HabitsPage = () => {
    const { data: { habits, completions }, loading, fetchData } = useHabits();
    const { theme } = useTheme();
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [showAddPanel, setShowAddPanel] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [formData, setFormData] = useState({ name: '', color: COLORS[0] });
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        fetchData(currentMonth);
        fetchAnalytics();
    }, [currentMonth]);

    const fetchAnalytics = async () => {
        try {
            const res = await habitsApi.getAnalytics('monthly');
            setAnalytics(res.data);
        } catch (e) { }
    };

    const getDaysArray = () => {
        const [year, month] = currentMonth.split('-');
        const days = new Date(year, month, 0).getDate();
        return Array.from({ length: days }, (_, i) => i + 1);
    };

    const days = useMemo(() => getDaysArray(), [currentMonth]);

    const dailyTrend = useMemo(() => {
        return days.map(d => {
            const dateStr = `${currentMonth}-${String(d).padStart(2, '0')}`;
            const count = completions.filter(c => c.completed_date.startsWith(dateStr)).length;
            return { day: d.toString(), completions: count };
        });
    }, [days, completions, currentMonth]);

    const handleToggle = async (habitId, dayOffset) => {
        const [year, month] = currentMonth.split('-');
        const dateStr = `${year}-${month}-${String(dayOffset).padStart(2, '0')}`;

        // Optimistic update logic could go here, for now rely on re-fetch
        try {
            await habitsApi.toggleCompletion(habitId, dateStr);
            await fetchData(currentMonth); // Refresh data
            fetchAnalytics();
        } catch (err) {
            alert("Failed to toggle habit");
        }
    };

    const isCompleted = (habitId, dayOffset) => {
        const [year, month] = currentMonth.split('-');
        const dateStr = `${year}-${month}-${String(dayOffset).padStart(2, '0')}`;
        return completions.some(c => c.habit_id === habitId && c.completed_date.startsWith(dateStr));
    };

    const handleSaveHabit = async (e) => {
        e.preventDefault();
        try {
            if (editingHabit) {
                await habitsApi.updateHabit(editingHabit.id, formData);
            } else {
                await habitsApi.createHabit(formData);
            }
            setFormData({ name: '', color: COLORS[0] });
            setEditingHabit(null);
            setShowAddPanel(false);
            fetchData(currentMonth);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save habit');
        }
    };

    const handleDeleteHabit = async (id) => {
        if (window.confirm("Delete this habit forever?")) {
            try {
                await habitsApi.deleteHabit(id);
                fetchData(currentMonth);
                fetchAnalytics();
            } catch (err) { }
        }
    };

    const monthLabel = new Date(currentMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });

    const todayStr = useMemo(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }, []);

    const totalPossible = habits.length * days.length;
    const totalThisMonth = analytics?.totalThisMonth || 0;
    const monthProgress = totalPossible > 0 ? Math.round((totalThisMonth / totalPossible) * 100) : 0;
    const ringData = [
        { name: 'Completed', value: totalThisMonth, fill: '#6366f1' },
        { name: 'Remaining', value: Math.max(0, totalPossible - totalThisMonth), fill: theme === 'dark' ? '#374151' : '#e5e7eb' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
                    <button
                        onClick={() => {
                            const d = new Date(currentMonth + '-01');
                            d.setMonth(d.getMonth() - 1);
                            setCurrentMonth(d.toISOString().slice(0, 7));
                        }}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-medium min-w-[120px] text-center dark:text-gray-100">{monthLabel}</span>
                    <button
                        onClick={() => {
                            const d = new Date(currentMonth + '-01');
                            d.setMonth(d.getMonth() + 1);
                            setCurrentMonth(d.toISOString().slice(0, 7));
                        }}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <Button onClick={() => setShowAddPanel(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Habit
                </Button>
            </div>

            <Card className="overflow-x-auto p-0">
                <div className="min-w-max">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
                                <th className="sticky left-0 bg-gray-50 dark:bg-gray-800/50 p-4 border-r border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 w-64 z-10 transition-colors">
                                    Habit
                                </th>
                                {days.map(d => (
                                    <th key={d} className="p-2 min-w-[40px] text-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        {d}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map(habit => (
                                <tr key={habit.id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                                    <td className="sticky left-0 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/30 p-4 border-r border-gray-200 dark:border-gray-700 z-10 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color }} />
                                                <span className="font-medium text-gray-800 dark:text-gray-200">{habit.name}</span>
                                            </div>
                                            <div className="hidden group-hover:flex items-center gap-1">
                                                <button onClick={() => { setEditingHabit(habit); setFormData({ name: habit.name, color: habit.color }); setShowAddPanel(true); }} className="text-gray-400 hover:text-indigo-600 p-1">
                                                    <Edit2 className="w-3 h-3" />
                                                </button>
                                                <button onClick={() => handleDeleteHabit(habit.id)} className="text-gray-400 hover:text-red-600 p-1">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    {days.map(d => {
                                        const dateStr = `${currentMonth}-${String(d).padStart(2, '0')}`;
                                        const isToday = dateStr === todayStr;
                                        const completed = isCompleted(habit.id, d);
                                        return (
                                            <td key={d} className="p-1 text-center border-r border-gray-50 dark:border-gray-700/30 last:border-0">
                                                <button
                                                    onClick={() => handleToggle(habit.id, d)}
                                                    disabled={!isToday}
                                                    title={!isToday ? "Habits can only be logged for today" : "Toggle habit"}
                                                    className={`w-8 h-8 rounded shrink-0 mx-auto flex items-center justify-center transition-all focus:outline-none ${!isToday && 'cursor-not-allowed opacity-50'} ${!completed ? 'bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:border-gray-600' : ''} ${isToday && !completed ? 'hover:bg-gray-200 dark:hover:bg-gray-700' : ''}`}
                                                    style={{
                                                        backgroundColor: completed ? habit.color : undefined,
                                                    }}
                                                >
                                                    {completed && <CheckCircle className="w-4 h-4 text-white" />}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            {habits.length === 0 && (
                                <tr>
                                    <td colSpan={days.length + 1} className="p-8 text-center text-gray-500">
                                        No habits active this month. Add one to get started!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                <Card className="flex flex-col items-center justify-center p-4">
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm w-full text-center mb-2">Month Progress</h3>
                    <div className="h-24 w-24 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ringData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={45}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {ringData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">{monthProgress}%</span>
                        </div>
                    </div>
                </Card>
                <Card className="flex flex-col justify-center">
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-1">Total This Month</h3>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalThisMonth}</div>
                </Card>
                <Card className="flex flex-col justify-center">
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-1">Current Streak</h3>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{analytics?.currentStreak || 0} <span className="text-sm text-gray-400 font-normal">days</span></div>
                </Card>
                <Card className="flex flex-col justify-center">
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-1">Best Streak</h3>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{analytics?.bestStreak || 0} <span className="text-sm text-gray-400 font-normal">days</span></div>
                </Card>
                <Card className="flex flex-col items-center justify-center p-4">
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm w-full text-center mb-3">Badges</h3>
                    <div className="flex gap-4">
                        <div className={`flex flex-col items-center transition-all ${analytics?.currentStreak >= 7 ? 'opacity-100 scale-110 drop-shadow-md' : 'opacity-30 grayscale'}`} title="7 Day Streak Builder">
                            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-500 flex items-center justify-center shadow-sm">
                                <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">7d</span>
                            </div>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-medium uppercase tracking-wider">Bronze</span>
                        </div>
                        <div className={`flex flex-col items-center transition-all ${analytics?.currentStreak >= 30 ? 'opacity-100 scale-110 drop-shadow-md' : 'opacity-30 grayscale'}`} title="30 Day Habit Master">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-500 flex items-center justify-center shadow-sm">
                                <span className="text-slate-600 dark:text-slate-300 font-bold text-sm">30d</span>
                            </div>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-medium uppercase tracking-wider">Silver</span>
                        </div>
                    </div>
                </Card>
            </div>

            <Card>
                <h3 className="text-gray-800 dark:text-gray-100 font-semibold mb-6">Completion Progress</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailyTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.2} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8b5cf6', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b5cf6', fontSize: 12 }} allowDecimals={false} />
                            <Tooltip
                                cursor={{ fill: '#6b7280', opacity: 0.1 }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1f2937', color: '#f3f4f6' }}
                                formatter={(value) => [value, 'Habits Completed']}
                                labelFormatter={(label) => `Day ${label}`}
                            />
                            <Bar dataKey="completions" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {showAddPanel && (
                <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 z-50 transform transition-all duration-300 translate-x-0 flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-semibold text-lg dark:text-gray-100">{editingHabit ? 'Edit Habit' : 'New Habit'}</h3>
                        <button onClick={() => { setShowAddPanel(false); setEditingHabit(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto">
                        <form onSubmit={handleSaveHabit} className="space-y-6">
                            <Input label="Habit Name" placeholder="e.g. Read 10 Pages" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {COLORS.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color: c })}
                                            className={`w-8 h-8 rounded-full border-2 focus:outline-none transition-transform ${formData.color === c ? 'scale-110 border-gray-900 dark:border-white' : 'border-transparent'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <Button type="submit" className="w-full">{editingHabit ? 'Save Changes' : 'Create Habit'}</Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Dimmed backdrop when panel is open */}
            {showAddPanel && (
                <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setShowAddPanel(false)} />
            )}
        </div>
    );
};

// CheckCircle local inline declaration to fix missing import 
const CheckCircle = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
)

export default HabitsPage;
