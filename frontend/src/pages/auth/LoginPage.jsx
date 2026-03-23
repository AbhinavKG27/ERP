import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, GraduationCap } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '../../api/authApi'
import useAuthStore from '../../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await authApi.login({ email, password })
      const payload = res.data?.data

      // New API shape: data.user + data.accessToken + data.refreshToken + data.expiresIn
      if (payload?.accessToken && payload?.refreshToken) {
        setAuth({
          user: payload.user,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken
        })
      } else {
        // Backward compatibility
        setAuth({
          user: payload.user ?? payload,
          accessToken: payload.accessToken ?? payload.token,
          refreshToken: payload.refreshToken
        })
      }

      toast.success(`Welcome back, ${payload?.user?.fullName || payload?.fullName || 'User'}!`)
      navigate('/')
    } catch (err) {
      toast.error(
        err?.response?.data?.message
        || err?.response?.data?.error
        || 'Invalid email or password'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg mb-4">
            <GraduationCap className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Apex ERP</h1>
          <p className="text-slate-500 mt-2">
            Secure access for Admin, Faculty and Students.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <form onSubmit={submit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your institute email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 pr-11 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute inset-y-0 right-0 px-3 text-slate-500 hover:text-slate-700">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded border-slate-300" />
                Remember me
              </label>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-[0.99] transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading
                ? <>
                    <Loader2 size={18}
                      className="animate-spin" />
                    Signing in...
                  </>
                : 'Login'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6
            border-t border-slate-100">
            <p className="text-xs font-semibold
              text-slate-400 mb-3 uppercase
              tracking-wider">
              Demo Credentials
            </p>
            <div className="space-y-2">
              {[
                { role: 'Admin',
                  e: 'admin@apex.edu',
                  p: 'Admin@123' },
                { role: 'Faculty',
                  e: 'faculty.ananya@apex.edu',
                  p: 'Admin@123' },
                { role: 'Student',
                  e: 'aarav.kulkarni23@apex.edu',
                  p: 'Admin@123' },
              ].map(c => (
                <button
                  key={c.role}
                  type="button"
                  onClick={() => {
                    setEmail(c.e)
                    setPassword(c.p)
                  }}
                  className="w-full flex items-center
                    gap-3 px-3 py-2 rounded-lg
                    hover:bg-slate-50 transition-colors
                    text-left">
                  <span className="w-16 text-xs
                    font-semibold text-slate-500">
                    {c.role}
                  </span>
                  <span className="text-xs
                    text-slate-400 truncate">
                    {c.e}
                  </span>
                  <span className="text-xs
                    text-slate-300 ml-auto
                    flex-shrink-0">
                    {c.p}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 Apex ERP. All rights reserved.
        </p>
      </div>
    </div>
  )
}