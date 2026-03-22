import { useNavigate } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-slate-50
      flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-50
          rounded-2xl flex items-center
          justify-center mx-auto mb-6">
          <ShieldOff size={40}
            className="text-red-400" />
        </div>
        <h1 className="text-2xl font-bold
          text-slate-800">Access Denied</h1>
        <p className="text-slate-500 mt-2">
          You don't have permission to view this page.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 px-5 py-2.5 bg-blue-600
            text-white text-sm font-semibold
            rounded-xl hover:bg-blue-700
            transition-colors">
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}