import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../api/authApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Request, 2: OTP / Success msg
    const [email, setEmail] = useState('');
    const [method, setMethod] = useState('otp'); // 'otp' | 'link'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // OTP State
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
    const [resendDisabled, setResendDisabled] = useState(true);
    const otpRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        if (step === 2 && method === 'otp' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        }

        // Enable resend after 60 seconds
        if (step === 2 && timeLeft <= 14 * 60 && resendDisabled) {
            setResendDisabled(false);
        }

        return () => clearInterval(timer);
    }, [step, method, timeLeft, resendDisabled]);

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await authApi.forgotPassword({ email, method });
            setSuccessMsg(res.message);
            setStep(2);
            if (method === 'otp') {
                setTimeLeft(15 * 60);
                setResendDisabled(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-advance
        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }

        // Auto-submit if all filled
        if (value && index === 5 && newOtp.every(v => v !== '')) {
            submitOtp(newOtp.join(''));
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
        if (pastedData) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);

            const focusIndex = Math.min(pastedData.length, 5);
            otpRefs.current[focusIndex].focus();

            if (pastedData.length === 6) {
                submitOtp(pastedData);
            }
        }
    };

    const submitOtp = async (otpCode) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authApi.verifyOtp({ email, otp: otpCode });
            navigate('/reset-password', { state: { resetToken: res.data.resetToken } });
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
            // Clear OTP on error
            setOtp(['', '', '', '', '', '']);
            otpRefs.current[0].focus();
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <Link to="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
                </Link>

                {step === 1 && (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
                            <p className="text-gray-500 mt-2">Choose how you want to reset your password</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleRequestSubmit} className="space-y-6">
                            <Input
                                label="Email address"
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setMethod('link')}
                                    className={`p-4 rounded-lg border text-left transition-all ${method === 'link'
                                            ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                                            : 'border-gray-200 hover:border-indigo-300'
                                        }`}
                                >
                                    <Mail className={`w-6 h-6 mb-2 ${method === 'link' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    <div className="font-semibold text-gray-900 text-sm">Email Link</div>
                                    <div className="text-xs text-gray-500 mt-1">Click a secure link to reset</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMethod('otp')}
                                    className={`p-4 rounded-lg border text-left transition-all ${method === 'otp'
                                            ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                                            : 'border-gray-200 hover:border-indigo-300'
                                        }`}
                                >
                                    <KeyRound className={`w-6 h-6 mb-2 ${method === 'otp' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    <div className="font-semibold text-gray-900 text-sm">One-Time Code</div>
                                    <div className="text-xs text-gray-500 mt-1">Enter a 6-digit code</div>
                                </button>
                            </div>

                            <Button type="submit" className="w-full" isLoading={loading}>
                                Send Reset Instructions
                            </Button>
                        </form>
                    </>
                )}

                {step === 2 && method === 'link' && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                        <p className="text-gray-600 mb-6">{successMsg}</p>
                        <p className="text-sm text-gray-500">
                            Didn't receive the email? <button onClick={() => setStep(1)} className="text-indigo-600 font-medium hover:underline">Try another method</button>
                        </p>
                    </div>
                )}

                {step === 2 && method === 'otp' && (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter verification code</h2>
                        <p className="text-gray-600 mb-8">We sent a 6-digit code to <span className="font-medium text-gray-900">{email}</span></p>

                        {error && (
                            <div className="mb-6 mx-auto max-w-sm p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-center gap-2 mb-6" onPaste={handleOtpPaste}>
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={el => otpRefs.current[idx] = el}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-colors"
                                />
                            ))}
                        </div>

                        <div className={`text-sm mb-6 ${timeLeft < 120 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                            OTP expires in {formatTime(timeLeft)}
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleRequestSubmit}
                            disabled={resendDisabled || loading}
                            className="w-full"
                        >
                            Resend OTP
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
