import React, { useState, useEffect } from 'react';
import { useWorkouts } from '../../hooks/useWorkouts';
import { workoutsApi } from '../../api/workoutsApi';
import { Dumbbell, Plus, Trash2, Edit2, Clock, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const WORKOUT_TYPES = ['Strength', 'Cardio', 'Flexibility', 'HIIT', 'Sport', 'Yoga', 'Other'];

const WorkoutsPage = () => {
    const { data: workouts, fetchData } = useWorkouts();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ workout_type: 'Strength', duration_minutes: '', workout_date: new Date().toISOString().split('T')[0], notes: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await workoutsApi.updateWorkout(editingId, { ...formData, duration_minutes: parseInt(formData.duration_minutes) });
            } else {
                await workoutsApi.logWorkout({ ...formData, duration_minutes: parseInt(formData.duration_minutes) });
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ workout_type: 'Strength', duration_minutes: '', workout_date: new Date().toISOString().split('T')[0], notes: '' });
            fetchData();
        } catch (err) {
            alert("Failed to save workout");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this workout?")) {
            await workoutsApi.deleteWorkout(id);
            fetchData();
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Activity</h2>
                <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
                    {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Log Workout</>}
                </Button>
            </div>

            {showForm && (
                <Card className="bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/30">
                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                                value={formData.workout_type}
                                onChange={e => setFormData({ ...formData, workout_type: e.target.value })}
                            >
                                {WORKOUT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <Input
                            label="Duration (mins)"
                            type="number"
                            min="1"
                            value={formData.duration_minutes}
                            onChange={e => setFormData({ ...formData, duration_minutes: e.target.value })}
                            required
                        />
                        <Input
                            label="Date"
                            type="date"
                            value={formData.workout_date}
                            onChange={e => setFormData({ ...formData, workout_date: e.target.value })}
                            required
                        />
                        <Input
                            label="Notes"
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="e.g. Felt great, pushed PR"
                        />
                        <div className="md:col-span-2 pt-2">
                            <Button type="submit">{editingId ? 'Update' : 'Save'} Workout</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {workouts.map(w => (
                    <Card key={w.id} className="group hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">
                                {w.workout_type}
                            </span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingId(w.id); setFormData({ ...w, workout_date: w.workout_date.split('T')[0] }); setShowForm(true); }} className="p-1 text-gray-400 hover:text-indigo-600"><Edit2 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => handleDelete(w.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>

                        <div className="space-y-2 mt-4">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 gap-2">
                                <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{w.duration_minutes}</span> mins
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                                <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                {new Date(w.workout_date).toLocaleDateString()}
                            </div>
                            {w.notes && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded border border-gray-100 dark:border-gray-700/50 mt-3 line-clamp-2">
                                    {w.notes}
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
                {workouts.length === 0 && !showForm && (
                    <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                        No workouts logged yet. Time to get moving!
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkoutsPage;
