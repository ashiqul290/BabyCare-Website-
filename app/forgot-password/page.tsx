'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        if (data.userId) {
          setUserId(data.userId);
          setStep('reset');
          if (data.demoOtp) setOtp(data.demoOtp);
        }
      } else {
        setErrorMsg(data.error || 'Request failed');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsDone(true);
      } else {
        setErrorMsg(data.error || 'Password reset failed');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Header />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full flex flex-col">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-800">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link href="/login" className="hover:text-slate-800">
            Login
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-slate-700">Forgot Password</span>
        </nav>

        <div className="w-full flex-1 flex items-center justify-center py-6">
          <div className="w-full max-w-[480px] bg-slate-50/70 border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-2xs">
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Reset Your Password</h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your mobile number or email to receive password recovery instructions.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isDone ? (
              <div className="text-center py-4 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Password Changed Successfully!</h3>
                <p className="text-xs text-slate-500">
                  Your new password is now active. Please log in with your updated credentials.
                </p>
                <Link
                  href="/login"
                  className="inline-block px-6 py-2.5 bg-[#006778] text-white rounded-full text-xs font-bold"
                >
                  Return to Login
                </Link>
              </div>
            ) : step === 'request' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mobile Number or Email
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter registered mobile or email"
                    className="w-full bg-white border border-slate-200 rounded-full py-2.5 px-4 text-xs text-slate-800 placeholder-slate-400 outline-hidden focus:border-[#006778] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3 bg-[#006778] hover:bg-[#09545f] text-white rounded-full text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Sending Instructions...' : 'Send Recovery Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {message && (
                  <p className="p-3 bg-teal-50 text-teal-800 rounded-xl text-xs font-medium">{message}</p>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Verification Code (OTP)
                  </label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-white border border-slate-200 rounded-full py-2.5 px-4 text-xs text-slate-800 outline-hidden focus:border-[#006778] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full bg-white border border-slate-200 rounded-full py-2.5 px-4 text-xs text-slate-800 outline-hidden focus:border-[#006778] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3 bg-[#006778] hover:bg-[#09545f] text-white rounded-full text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>
            )}

            <div className="mt-8 pt-5 border-t border-slate-200/70 text-center text-xs">
              <Link href="/login" className="text-[#006778] font-bold hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
