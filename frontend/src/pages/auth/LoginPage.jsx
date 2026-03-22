import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, GraduationCap } from 'lucide-react'
import { authApi } from '../../api/authApi'
import useAuthStore from '../../store/authStore'
import { getRoleHomePath } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const { setAuth } = useAuthStore()
  const navigate    = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await authApi.login({ email, password })

      // Log full response to debug
      console.log('Full response:', res)
      console.log('res.data:', res.data)
      console.log('res.data.data:', res.data?.data)

      // Try both response structures
      const d = res.data?.data ?? res.data

      console.log('Parsed d:', d)

      if (!d?.accessToken) {
        setError('Login failed. Please try again.')
        toast.error('Login failed')
        return
      }

      setAuth(
        {
          id:       d.userId,
          fullName: d.fullName,
          email:    d.email,
          role:     d.role,
        },
        {
          accessToken:  d.accessToken,
          refreshToken: d.refreshToken,
        }
      )

      toast.success(`Welcome, ${d.fullName}!`)
      navigate(getRoleHomePath(d.role))

    } catch (err) {
      console.error('Login error:', err)
      console.error('Error response:', err?.response?.data)
      const msg = err?.response?.data?.message
        || 'Invalid email or password'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center
      justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl
            bg-blue-600 flex items-center justify-center
            mx-auto mb-4">
            <GraduationCap size={28}
              className="text-white" />
          </div>
          <p className="text-xs font-bold tracking-widest
            text-blue-600 uppercase mb-1">
            Apex ERP
          </p>
          <h1 className="text-3xl font-bold
            text-slate-800">
            Sign in to continue
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Secure access for Admin, Faculty and Students.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8
          shadow-sm border border-slate-100">

          <form onSubmit={handleSubmit}
            className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm
                font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@apex.edu"
                required
                className="w-full px-4 py-3 rounded-xl
                  border border-slate-200 text-sm
                  text-slate-700 outline-none
                  focus:ring-2 focus:ring-blue-500/20
                  focus:border-blue-400 transition-all
                  placeholder-slate-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm
                font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e =>
                    setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 rounded-xl
                    border border-slate-200 text-sm
                    text-slate-700 outline-none pr-11
                    focus:ring-2 focus:ring-blue-500/20
                    focus:border-blue-400 transition-all
                    placeholder-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3
                    top-1/2 -translate-y-1/2
                    text-slate-400 hover:text-slate-600">
                  {showPass
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-50
                border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl
                bg-blue-600 hover:bg-blue-700
                disabled:bg-blue-400 text-white
                font-semibold text-sm transition-all
                flex items-center justify-center gap-2
                shadow-lg shadow-blue-500/20">
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
                  e: 'rajesh.kumar@apex.edu',
                  p: 'FAC001' },
                { role: 'Student',
                  e: 'arjun.sharma@student.apex.edu',
                  p: 'CSE2022001' },
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
      </div>
    </div>
  )
}