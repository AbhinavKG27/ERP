import { useState } from 'react'
import { useQuery, useQueryClient }
  from '@tanstack/react-query'
import {
  CreditCard, Plus, Receipt,
  CheckCircle, Clock, AlertCircle,
  DollarSign
} from 'lucide-react'
import { feeApi } from '../../api/feeApi'
import { studentApi } from '../../api/studentApi'
import useAuthStore from '../../store/authStore'
import { ROLES, ACADEMIC_YEARS }
  from '../../utils/constants'
import {
  formatCurrency, formatDate,
  getFeeStatusBadge, getInitials
} from '../../utils/helpers'
import toast from 'react-hot-toast'
import MakePaymentModal from './MakePaymentModal'

export default function FeePage() {
  const { user } = useAuthStore()
  const isStudent = user?.role === ROLES.STUDENT
  const isAdmin   = user?.role === ROLES.ADMIN
  const isFinance = user?.role === ROLES.FINANCE

  const [academicYear, setAcademicYear] =
    useState('2025-26')
  const [showPayment, setShowPayment] =
    useState(false)
  const [selectedFee, setSelectedFee] =
    useState(null)
  const queryClient = useQueryClient()

  // Get student record for student login
  const { data: myStudent } = useQuery({
    queryKey: ['my-student-fee', user?.id],
    queryFn:  () =>
      studentApi.getAll(0, 100)
        .then(r => {
          const all = r.data?.data?.content
            || r.data?.data || []
          return all.find(s =>
            s.email === user?.email) || null
        }),
    enabled: isStudent,
  })

  // Student: own fees
  const { data: myFees = [] } = useQuery({
    queryKey: ['my-fees',
      myStudent?.id, academicYear],
    queryFn:  () =>
      feeApi.getStudentFees(
        myStudent.id, academicYear)
        .then(r => r.data?.data || []),
    enabled: isStudent && !!myStudent?.id,
  })

  // Admin/Finance: all students
  const { data: students = [] } = useQuery({
    queryKey: ['students-fee'],
    queryFn:  () =>
      studentApi.getAll(0, 50)
        .then(r =>
          r.data?.data?.content
          || r.data?.data || []),
    enabled: !isStudent,
  })

  const totalFee    = myFees.reduce((a, b) =>
    a + (b.totalAmount || 0), 0)
  const totalPaid   = myFees.reduce((a, b) =>
    a + (b.paidAmount || 0), 0)
  const totalBalance = myFees.reduce((a, b) =>
    a + (b.balanceAmount || 0), 0)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center
        justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold
            text-slate-800">Fee Management</h1>
          <p className="text-slate-500
            text-sm mt-1">
            {isStudent
              ? 'Your fee details and payments'
              : 'Manage student fees and payments'}
          </p>
        </div>
        <select
          value={academicYear}
          onChange={e =>
            setAcademicYear(e.target.value)}
          className="px-3 py-2 border
            border-slate-200 rounded-xl
            text-sm text-slate-600 bg-white
            outline-none focus:border-blue-400">
          {ACADEMIC_YEARS.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Student View */}
      {isStudent && (
        <div className="space-y-4">

          {/* Summary cards */}
          <div className="grid grid-cols-1
            sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Fee',
                value: formatCurrency(totalFee),
                icon: CreditCard,
                color: 'text-blue-600',
                bg: 'bg-blue-50' },
              { label: 'Paid',
                value: formatCurrency(totalPaid),
                icon: CheckCircle,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50' },
              { label: 'Balance',
                value: formatCurrency(totalBalance),
                icon: AlertCircle,
                color: totalBalance > 0
                  ? 'text-red-600'
                  : 'text-emerald-600',
                bg: totalBalance > 0
                  ? 'bg-red-50'
                  : 'bg-emerald-50' },
            ].map(s => (
              <div key={s.label}
                className="bg-white rounded-2xl
                  p-5 border border-slate-100
                  shadow-sm">
                <div className="flex items-center
                  justify-between">
                  <div>
                    <p className="text-sm
                      text-slate-500">
                      {s.label}
                    </p>
                    <p className={`text-2xl
                      font-bold mt-1 ${s.color}`}>
                      {s.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12
                    rounded-xl ${s.bg}
                    flex items-center
                    justify-center`}>
                    <s.icon size={22}
                      className={s.color} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fee records */}
          {myFees.length === 0 && (
            <div className="bg-white rounded-2xl
              border border-slate-100 shadow-sm
              p-12 text-center">
              <CreditCard size={40}
                className="text-slate-200
                  mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                No fee records for {academicYear}
              </p>
            </div>
          )}

          {myFees.map(fee => (
            <div key={fee.id}
              className="bg-white rounded-2xl
                border border-slate-100
                shadow-sm p-5">
              <div className="flex items-start
                justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center
                    gap-2">
                    <h3 className="text-base
                      font-bold text-slate-800">
                      {fee.feeType}
                    </h3>
                    <span className={`px-2.5 py-0.5
                      rounded-lg text-xs
                      font-semibold border
                      ${getFeeStatusBadge(
                        fee.status)}`}>
                      {fee.status}
                    </span>
                  </div>
                  <p className="text-sm
                    text-slate-500 mt-1">
                    Academic Year: {fee.academicYear}
                  </p>
                </div>
                {fee.status !== 'PAID' && (
                  <button
                    onClick={() => {
                      setSelectedFee(fee)
                      setShowPayment(true)
                    }}
                    className="flex items-center
                      gap-2 px-4 py-2 bg-blue-600
                      hover:bg-blue-700 text-white
                      text-sm font-semibold
                      rounded-xl transition-colors">
                    <CreditCard size={16} />
                    Pay Now
                  </button>
                )}
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center
                  justify-between text-sm mb-2">
                  <span className="text-slate-500">
                    Payment Progress
                  </span>
                  <span className="font-semibold
                    text-slate-700">
                    {formatCurrency(fee.paidAmount)}
                    {' / '}
                    {formatCurrency(fee.totalAmount)}
                  </span>
                </div>
                <div className="h-2 bg-slate-100
                  rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500
                      rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        (fee.paidAmount /
                          fee.totalAmount) * 100,
                        100)}%`
                    }}
                  />
                </div>
                <div className="flex items-center
                  justify-between mt-2">
                  <span className="text-xs
                    text-slate-400">
                    Balance:{' '}
                    {formatCurrency(
                      fee.balanceAmount)}
                  </span>
                  {fee.status === 'PAID' && (
                    <span className="text-xs
                      text-emerald-600 font-semibold">
                      ✓ Fully Paid
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin/Finance View */}
      {!isStudent && (
        <div className="bg-white rounded-2xl
          border border-slate-100 shadow-sm
          overflow-hidden">
          <div className="p-4 border-b
            border-slate-100">
            <h2 className="text-base font-semibold
              text-slate-700">
              Student Fee Records
            </h2>
          </div>
          <div className="divide-y divide-slate-50">
            {students.length === 0 && (
              <div className="text-center py-12
                text-slate-400 text-sm">
                No students found
              </div>
            )}
            {students.map(s => (
              <StudentFeeRow
                key={s.id}
                student={s}
                academicYear={academicYear}
                onPay={(fee) => {
                  setSelectedFee(fee)
                  setShowPayment(true)
                }}
              />
            ))}
          </div>
        </div>
      )}

      {showPayment && selectedFee && (
        <MakePaymentModal
          fee={selectedFee}
          onClose={() => {
            setShowPayment(false)
            setSelectedFee(null)
          }}
          onSuccess={() => {
            setShowPayment(false)
            setSelectedFee(null)
            queryClient.invalidateQueries(
              ['my-fees'])
            toast.success('Payment recorded!')
          }}
        />
      )}
    </div>
  )
}

function StudentFeeRow({
  student, academicYear, onPay
}) {
  const [expanded, setExpanded] = useState(false)

  const { data: fees = [] } = useQuery({
    queryKey: ['fees',
      student.id, academicYear],
    queryFn:  () =>
      feeApi.getStudentFees(
        student.id, academicYear)
        .then(r => r.data?.data || []),
    enabled: expanded,
  })

  const totalBalance = fees.reduce(
    (a, b) => a + (b.balanceAmount || 0), 0)

  return (
    <div>
      <div
        className="flex items-center gap-4
          px-4 py-3 hover:bg-slate-50/50
          cursor-pointer transition-colors"
        onClick={() =>
          setExpanded(e => !e)}>
        <div className="w-9 h-9 rounded-xl
          bg-gradient-to-br from-blue-500
          to-indigo-600 flex items-center
          justify-center text-white text-xs
          font-bold flex-shrink-0">
          {getInitials(student.fullName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold
            text-slate-800 truncate">
            {student.fullName}
          </p>
          <p className="text-xs text-slate-400">
            {student.rollNumber}
          </p>
        </div>
        {expanded && totalBalance > 0 && (
          <span className="text-xs font-semibold
            text-red-600 bg-red-50 px-2.5 py-1
            rounded-lg">
            Due: {formatCurrency(totalBalance)}
          </span>
        )}
        <span className={`text-slate-400
          text-sm transition-transform inline-block
          ${expanded ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </div>

      {expanded && (
        <div className="px-4 pb-4 bg-slate-50/30">
          {fees.length === 0 && (
            <p className="text-xs text-slate-400
              py-3">
              No fee records for {academicYear}
            </p>
          )}
          <div className="space-y-2 mt-2">
            {fees.map(fee => (
              <div key={fee.id}
                className="bg-white rounded-xl
                  p-3 border border-slate-100
                  flex items-center
                  justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold
                    text-slate-700">
                    {fee.feeType}
                  </p>
                  <p className="text-xs
                    text-slate-400 mt-0.5">
                    {formatCurrency(fee.paidAmount)}
                    {' / '}
                    {formatCurrency(fee.totalAmount)}
                  </p>
                </div>
                <div className="flex items-center
                  gap-2">
                  <span className={`px-2.5 py-0.5
                    rounded-lg text-xs
                    font-semibold border
                    ${getFeeStatusBadge(
                      fee.status)}`}>
                    {fee.status}
                  </span>
                  {fee.status !== 'PAID' && (
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        onPay(fee)
                      }}
                      className="px-3 py-1
                        bg-blue-600 text-white
                        text-xs font-semibold
                        rounded-lg hover:bg-blue-700
                        transition-colors">
                      Pay
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}