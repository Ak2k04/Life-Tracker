import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../api/authApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isShaking, setIsShaking] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!identifier || !password) {
            setError('Username/Email and Password are required');
            triggerShake();
            return;
        }

        setLoading(true);
        try {
            const res = await authApi.login({ identifier, password });
            login(res.data.token, res.data.user, rememberMe);
            navigate('/dashboard/habits');
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to reach the server. Please try again.');
            triggerShake();
        } finally {
            setLoading(false);
        }
    };

    const triggerShake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-200">
            {/* Left Panel - Branding */}
            <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient bg-[length:200%_200%] items-center justify-center p-12 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10 z-0"></div>
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-extrabold mb-6 tracking-tight flex items-center gap-3">
                        <span className="text-4xl">🌟</span> Life Dashboard
                    </h1>
                    <p className="text-xl md:text-2xl font-light mb-12 text-indigo-50 leading-relaxed">
                        "Track habits, workouts, and your finances all in one place."
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                            <CheckCircle2 className="w-5 h-5 text-indigo-200" />
                            <span className="font-medium">Habit Streaks</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                            <CheckCircle2 className="w-5 h-5 text-indigo-200" />
                            <span className="font-medium">Workout Logs</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                            <CheckCircle2 className="w-5 h-5 text-indigo-200" />
                            <span className="font-medium">Finance Insights</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
                <div className={`w-full max-w-[420px] transition-transform ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h2>
                        <p className="text-gray-500 dark:text-gray-400">Sign in to your dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex justify-between items-center animate-fade-in relative">
                            <span>{error}</span>
                            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">×</button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors duration-200">
                        <Input
                            label="Username or Email"
                            placeholder="Enter your username or email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                                <input
                                    type="checkbox"
                                    className="rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 w-4 h-4 cursor-pointer"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                                Forgot pw?
                            </Link>
                        </div>

                        <Button type="submit" className="w-full py-2.5 text-base" isLoading={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <div className="relative mt-8 mb-4">
                            <div className="absolute inset-0 flex items-center">
                                <hr className="w-full border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors">or</span>
                            </div>
                        </div>

                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-semibold inline-flex items-center gap-1 group transition-colors">
                                Create one
                                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
