import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '../../api/authApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ fullName: '', username: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Password strength logic
    const getPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[a-z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass)) strength++;
        if (/[^A-Za-z0-9]/.test(pass)) strength++;
        return strength; // 0-5
    };

    const strength = getPasswordStrength(formData.password);
    const strengthLabels = ['Weak', 'Weak', 'Fair', 'Strong', 'Very Strong', 'Very Strong'];
    const strengthColors = ['bg-red-400', 'bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-emerald-500', 'bg-emerald-500'];

    const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setGlobalError(null);

        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password
            };
            const res = await authApi.register(payload);
            setSuccessMsg(res.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            if (err.response?.status === 422 && err.response.data.errors) {
                const fieldErrors = {};
                err.response.data.errors.forEach(e => { fieldErrors[e.field] = e.message; });
                setErrors(fieldErrors);
            } else {
                setGlobalError(err.response?.data?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (successMsg) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 flex-col p-6 text-center transition-colors duration-200">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account Created!</h2>
                <p className="text-gray-600 dark:text-gray-300">{successMsg}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 animate-pulse">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Join Life Dashboard today</p>
                </div>

                {globalError && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{globalError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input label="Full Name" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleInputChange} />
                    <Input label="Username" name="username" placeholder="johndoe" value={formData.username} onChange={handleInputChange} error={errors.username} />
                    <Input label="Email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} error={errors.email} />

                    <div>
                        <Input label="Password" name="password" type="password" placeholder="Create a password" value={formData.password} onChange={handleInputChange} error={errors.password} />
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="text-gray-500 dark:text-gray-400">Password strength:</span>
                                    <span className={`font-medium ${strength >= 3 ? 'text-green-600 dark:text-green-500' : 'text-gray-700 dark:text-gray-300'}`}>{strengthLabels[strength]}</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div key={level} className={`h-full flex-1 border-r border-white dark:border-gray-800 last:border-0 transition-colors duration-300 ${level <= strength ? strengthColors[strength] : 'bg-transparent'}`} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="relative">
                            <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleInputChange} error={errors.confirmPassword} />
                            {formData.confirmPassword && (
                                <div className="absolute right-3 top-9">
                                    {passwordsMatch ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                                </div>
                            )}
                        </div>
                    </div>

                    <Button type="submit" className="w-full mt-2" isLoading={loading}>
                        Create Account
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
