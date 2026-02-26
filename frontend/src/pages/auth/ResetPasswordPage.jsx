import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../api/authApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [resetToken, setResetToken] = useState(location.state?.resetToken || null);
    const [loading, setLoading] = useState(!resetToken);
    const [error, setError] = useState(null);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(3);

    // Validate link if token is coming from URL query params
    useEffect(() => {
        const validateTokenFromUrl = async () => {
            const rawToken = searchParams.get('token');
            const uid = searchParams.get('uid');

            if (rawToken && uid) {
                try {
                    const res = await authApi.validateResetLink(rawToken, uid);
                    setResetToken(res.data.resetToken);
                } catch (err) {
                    setError('This reset link is invalid or has expired.');
                } finally {
                    setLoading(false);
                }
            } else if (!resetToken) {
                setError('Missing reset token. Please request a new link.');
                setLoading(false);
            }
        };

        if (!resetToken) {
            validateTokenFromUrl();
        }
    }, [searchParams, resetToken]);

    useEffect(() => {
        if (success && countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else if (success && countdown === 0) {
            navigate('/login');
        }
    }, [success, countdown, navigate]);

    const getPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[a-z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass)) strength++;
        if (/[^A-Za-z0-9]/.test(pass)) strength++;
        return strength;
    };

    const strength = getPasswordStrength(password);
    const strengthLabels = ['Weak', 'Weak', 'Fair', 'Strong', 'Very Strong', 'Very Strong'];
    const strengthColors = ['bg-red-400', 'bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-emerald-500', 'bg-emerald-500'];
    const passwordsMatch = password && confirmPassword && password === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (strength < 5) {
            setError('Password does not meet all requirements');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await authApi.resetPassword({ resetToken, newPassword: password });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Token may have expired.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Spinner className="w-8 h-8 text-indigo-600" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated</h2>
                    <div className="p-4 bg-green-50 text-green-700 rounded-lg mb-6 text-sm">
                        Your password has been successfully reset.
                    </div>
                    <p className="text-gray-500">Redirecting to login in {countdown}...</p>
                </div>
            </div>
        );
    }

    if (error && !resetToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h2>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <Link to="/forgot-password" className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 w-full transition-colors">
                        Request a new link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Create new password</h2>
                    <p className="text-gray-500 mt-2">Enter your new secure password</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Input
                            label="New Password"
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {password && (
                            <div className="mt-2 text-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-500">Password strength:</span>
                                    <span className={`font-medium ${strength >= 3 ? 'text-green-600' : 'text-gray-700'}`}>
                                        {strengthLabels[strength]}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div key={level} className={`h-full flex-1 border-r border-white last:border-0 transition-colors duration-300 ${level <= strength ? strengthColors[strength] : 'bg-transparent'}`} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {confirmPassword && (
                            <div className="absolute right-3 top-9">
                                {passwordsMatch ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
                            </div>
                        )}
                    </div>

                    <Button type="submit" className="w-full" isLoading={isSubmitting}>
                        Reset Password
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
