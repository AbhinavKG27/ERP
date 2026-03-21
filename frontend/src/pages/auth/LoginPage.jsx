import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, GraduationCap, Loader2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const schema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(3, 'Password is required'),
})

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
    } catch (err) {
      const msg = err?.response?.data?.message
        || 'Invalid email or password'
      setError('password', { message: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel ───────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative
        bg-gradient-to-br from-slate-900 via-blue-950
        to-slate-900 flex-col items-center
        justify-center p-12 overflow-hidden">

        {/* Background circles */}
        <div className="absolute top-[-80px] left-[-80px]
          w-96 h-96 rounded-full
          bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-80px]
          w-96 h-96 rounded-full
          bg-indigo-500/10 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center
            w-20 h-20 rounded-2xl bg-blue-600/20
            border border-blue-500/30 mx-auto mb-6">
            <GraduationCap
              className="text-blue-400" size={40} />
          </div>

          <h1 className="text-4xl font-bold text-white mb-3">
            Apex ERP
          </h1>
          <p className="text-blue-300 text-lg mb-12">
            Apex Institute of Technology
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Students',   value: '2,500+' },
              { label: 'Faculty',    value: '150+'   },
              { label: 'Courses',    value: '80+'    },
            ].map((s) => (
              <div key={s.label}
                className="bg-white/5 border border-white/10
                  rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold
                  text-white">{s.value}</div>
                <div className="text-blue-300
                  text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Modules */}
          <div className="mt-12 grid grid-cols-2 gap-3
            text-left">
            {[
              '📚 Academic Management',
              '✅ Attendance Tracking',
              '💰 Fee Management',
              '🏠 Hostel Management',
              '📖 Library System',
              '📊 Analytics & Reports',
            ].map((m) => (
              <div key={m}
                className="flex items-center gap-2
                  text-blue-200/70 text-sm">
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ──────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center
        justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">

          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center
            gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl
              bg-blue-600 flex items-center justify-center">
              <GraduationCap
                className="text-white" size={22} />
            </div>
            <span className="text-xl font-bold
              text-slate-800">Apex ERP</span>
          </div>

          <h2 className="text-3xl font-bold
            text-slate-800 mb-2">
            Welcome back
          </h2>
          <p className="text-slate-500 mb-8">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)}
            className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium
                text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@apex.edu"
                className={`w-full px-4 py-3 rounded-xl
                  border bg-white text-slate-800
                  placeholder-slate-400 outline-none
                  transition-all text-sm
                  focus:ring-2 focus:ring-blue-500/20
                  focus:border-blue-500
                  ${errors.email
                    ? 'border-red-400'
                    : 'border-slate-200'}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium
                text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-xl
                    border bg-white text-slate-800
                    placeholder-slate-400 outline-none
                    transition-all text-sm pr-11
                    focus:ring-2 focus:ring-blue-500/20
                    focus:border-blue-500
                    ${errors.password
                      ? 'border-red-400'
                      : 'border-slate-200'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2
                    -translate-y-1/2 text-slate-400
                    hover:text-slate-600 transition-colors">
                  {showPass
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl
                bg-blue-600 hover:bg-blue-700
                disabled:bg-blue-400
                text-white font-semibold text-sm
                transition-all duration-200
                flex items-center justify-center gap-2
                shadow-lg shadow-blue-500/25">
              {loading
                ? <>
                    <Loader2 size={18}
                      className="animate-spin" />
                    Signing in...
                  </>
                : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl
            border border-blue-100">
            <p className="text-xs font-semibold
              text-blue-700 mb-2">
              Demo Credentials
            </p>
            <div className="space-y-1">
              {[
                { role: 'Admin',
                  email: 'admin@apex.edu',
                  pass: 'Admin@123' },
                { role: 'Faculty',
                  email: 'rajesh.kumar@apex.edu',
                  pass: 'FAC001' },
                { role: 'Student',
                  email: 'arjun.sharma@student.apex.edu',
                  pass: 'CSE2022001' },
              ].map((c) => (
                <div key={c.role}
                  className="flex items-center gap-2
                    text-xs text-blue-600">
                  <span className="font-medium
                    w-14">{c.role}:</span>
                  <span className="text-slate-500">
                    {c.email}
                  </span>
                  <span className="text-slate-400">
                    / {c.pass}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs
            text-slate-400 mt-6">
            © 2026 Apex Institute of Technology
          </p>
        </div>
      </div>
    </div>
  )
}