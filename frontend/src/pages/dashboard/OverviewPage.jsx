import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from '../../components/ui/Card';
import { useHabits } from '../../hooks/useHabits';
import { useWorkouts } from '../../hooks/useWorkouts';
import { useFinance } from '../../hooks/useFinance';
import { CheckCircle, Activity, DollarSign, GripVertical } from 'lucide-react';

const SortableItem = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div ref={setNodeRef} style={style} className={`relative ${isDragging ? 'z-50' : ''}`}>
            <div {...attributes} {...listeners} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10 hidden sm:block">
                <GripVertical className="w-5 h-5" />
            </div>
            <div className="sm:pl-10">
                {children}
            </div>
        </div>
    );
};

const OverviewPage = () => {
    const { data: { habits } } = useHabits();
    const { workouts } = useWorkouts();
    const { summary } = useFinance();

    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem('dashboard-layout');
        return saved ? saved.split(',') : ['habits', 'workouts', 'finance'];
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                const newArr = arrayMove(items, oldIndex, newIndex);
                localStorage.setItem('dashboard-layout', newArr.join(','));
                return newArr;
            });
        }
    };

    const renderWidget = (id) => {
        switch (id) {
            case 'habits':
                return (
                    <Card className="h-32 sm:h-40 flex items-center p-4 sm:p-6 border-l-4 border-l-primary-500 hover:border-l-[6px] transition-all">
                        <div className="bg-primary-50 dark:bg-primary-900/50 p-4 rounded-full mr-6">
                            <CheckCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Active Habits</h3>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">{habits?.length || 0} habits tracked this month.</p>
                        </div>
                    </Card>
                );
            case 'workouts':
                return (
                    <Card className="h-32 sm:h-40 flex items-center p-4 sm:p-6 border-l-4 border-l-rose-500 hover:border-l-[6px] transition-all">
                        <div className="bg-rose-50 dark:bg-rose-900/50 p-4 rounded-full mr-6">
                            <Activity className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Workouts</h3>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">{workouts?.length || 0} workouts logged.</p>
                        </div>
                    </Card>
                );
            case 'finance':
                return (
                    <Card className="h-32 sm:h-40 flex items-center p-4 sm:p-6 border-l-4 border-l-emerald-500 hover:border-l-[6px] transition-all">
                        <div className="bg-emerald-50 dark:bg-emerald-900/50 p-4 rounded-full mr-6">
                            <DollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Financial Summary</h3>
                            <div className="flex flex-col sm:flex-row sm:gap-4 mt-1">
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">+${summary?.totalIncome || 0}</span>
                                <span className="text-rose-600 dark:text-rose-400 font-medium">-${summary?.totalExpenses || 0}</span>
                            </div>
                        </div>
                    </Card>
                );
            default: return null;
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
                <p className="text-gray-500 dark:text-gray-400">Drag items to rearrange your layout.</p>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {items.map(id => (
                            <SortableItem key={id} id={id}>
                                {renderWidget(id)}
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default OverviewPage;
