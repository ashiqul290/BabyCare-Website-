// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { ChevronRight, AlertCircle } from 'lucide-react';
// import { Header } from '@/components/layout/Header';
// import { Navbar } from '@/components/layout/Navbar';
// import { Footer } from '@/components/layout/Footer';
// import { CartDrawer } from '@/components/layout/CartDrawer';
// import { useAuth } from '@/lib/auth-context';

// export default function RegisterPage() {
//   const router = useRouter();
//   const { register } = useAuth();

//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMsg, setErrorMsg] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMsg('');

//     const cleanPhone = phone.trim().replace(/[\s-]/g, '');
//     if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
//       setErrorMsg('Please enter a valid 11-digit Bangladeshi mobile number starting with 01');
//       return;
//     }

//     if (password.length < 6) {
//       setErrorMsg('Password must be at least 6 characters long');
//       return;
//     }

//     setLoading(true);
//     try {
//       const result = await register({
//         name: name.trim(),
//         phone: cleanPhone,
//         email: email.trim() || undefined,
//         password,
//       });

//       if (!result.success) {
//         setErrorMsg(result.error || 'Registration failed');
//       } else {
//         router.push('/account');
//       }
//     } catch {
//       setErrorMsg('An unexpected error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
//       <Header />
//       <Navbar />

//       <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full flex flex-col">
//         {/* Breadcrumb Navigation */}
//         <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
//           <Link href="/" className="hover:text-slate-800">
//             Home
//           </Link>
//           <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
//           <span>Account</span>
//           <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
//           <span className="font-semibold text-slate-700">Register</span>
//         </nav>

//         {/* Centered Light-Gray Registration Card */}
//         <div className="w-full flex-1 flex items-center justify-center py-6">
//           <div className="w-full max-w-[480px] bg-slate-50/70 border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-2xs">
//             <div className="mb-6">
//               <p className="text-xs sm:text-sm text-slate-500 font-medium">Join BabyCare Family</p>
//               <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
//                 Create Customer Account
//               </h1>
//             </div>

//             {errorMsg && (
//               <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
//                 <AlertCircle className="w-4 h-4 shrink-0" />
//                 <span>{errorMsg}</span>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-xs font-semibold text-slate-700 mb-1.5">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="e.g. Farhana Ahmed"
//                   className="w-full bg-white border border-slate-200 rounded-full py-2.5 px-4 text-xs text-slate-800 placeholder-slate-400 outline-hidden focus:border-[#006778] focus:ring-1 focus:ring-[#006778] transition-all"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-slate-700 mb-1.5">
//                   Mobile Number (Bangladesh)
//                 </label>
//                 <input
//                   type="tel"
//                   required
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   placeholder="017XXXXXXXX"
//                   className="w-full bg-white border border-slate-200 rounded-full py-2.5 px-4 text-xs text-slate-800 placeholder-slate-400 outline-hidden focus:border-[#006778] focus:ring-1 focus:ring-[#006778] transition-all"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-slate-700 mb-1.5">
//                   Email Address (Optional)
//                 </label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="name@example.com"
//                   className="w-full bg-white border border-slate-200 rounded-full py-2.5 px-4 text-xs text-slate-800 placeholder-slate-400 outline-hidden focus:border-[#006778] focus:ring-1 focus:ring-[#006778] transition-all"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-slate-700 mb-1.5">
//                   Password (min. 6 characters)
//                 </label>
//                 <input
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Create a strong password"
//                   className="w-full bg-white border border-slate-200 rounded-full py-2.5 px-4 text-xs text-slate-800 placeholder-slate-400 outline-hidden focus:border-[#006778] focus:ring-1 focus:ring-[#006778] transition-all"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full mt-3 py-3 bg-[#006778] hover:bg-[#09545f] text-white rounded-full text-xs font-bold tracking-wide transition-all shadow-xs disabled:opacity-50 cursor-pointer"
//               >
//                 {loading ? 'Creating Account...' : 'Register Now'}
//               </button>
//             </form>

//             <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
//               By creating an account, you agree to Babycare&apos;s{' '}
//               <Link href="/terms" className="text-[#006778] hover:underline">
//                 Conditions of Use
//               </Link>{' '}
//               and{' '}
//               <Link href="/privacy" className="text-[#006778] hover:underline">
//                 Privacy Policy
//               </Link>
//               .
//             </p>

//             <div className="mt-8 pt-5 border-t border-slate-200/70 text-xs">
//               <span className="text-slate-600">Already Have an Account? </span>
//               <Link href="/login" className="text-[#006778] font-bold hover:underline">
//                 Log In Here
//               </Link>
//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer />
//       <CartDrawer />
//     </div>
//   );
// }
