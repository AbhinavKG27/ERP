import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../../api/authApi'
import useAuthStore from '../../store/authStore'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { normalizeApiData } from '../../utils/format'
import { getDefaultRouteByRole } from '../../utils/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await authApi.login({ email, password })
      const authPayload = normalizeApiData(response)
      setAuth(authPayload)
      toast.success('Welcome back!')

      navigate(getDefaultRouteByRole(authPayload.role), { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <div className="glass w-full max-w-md rounded-3xl p-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-600">Apex ERP</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Sign in to continue</h1>
        <p className="mt-1 text-sm text-slate-500">Secure access for Admin, Faculty and Students.</p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full" loading={loading}>
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}