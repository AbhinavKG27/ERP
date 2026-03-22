import { useState } from 'react'
import { X, Loader2, CreditCard } from 'lucide-react'
import { feeApi } from '../../api/feeApi'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function MakePaymentModal({
  fee, onClose, onSuccess
}) {
  const [amount,    setAmount]    =
    useState(fee.balanceAmount || 0)
  const [method,    setMethod]    =
    useState('ONLINE')
  const [txnId,     setTxnId]     = useState('')
  const [remarks,   setRemarks]   = useState('')
  const [loading,   setLoading]   = useState(false)

  const handlePay = async () => {
    if (!amount || amount <= 0) {
      toast.error('Enter valid amount')
      return
    }
    setLoading(true)
    try {
      await feeApi.makePayment({
        studentFeeId:   fee.id,
        amount:         Number(amount),
        paymentMethod:  method,
        transactionId:  txnId || undefined,
        paymentGateway: method === 'ONLINE'
          ? 'RAZORPAY' : 'MANUAL',
        remarks,
      })
      onSuccess()
    } catch (err) {
      toast.error(
        err?.response?.data?.message
        || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50
      backdrop-blur-sm z-50 flex items-center
      justify-center p-4">
      <div className="bg-white rounded-2xl
        w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center
          justify-between p-5
          border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl
              bg-blue-50 flex items-center
              justify-center">
              <CreditCard size={20}
                className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold
                text-slate-800">
                Make Payment
              </h2>
              <p className="text-xs text-slate-400">
                {fee.feeType} — {fee.academicYear}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 hover:bg-slate-100
              rounded-lg transition-colors">
            <X size={18}
              className="text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">

          {/* Fee summary */}
          <div className="bg-slate-50 rounded-xl
            p-4 space-y-2">
            {[
              ['Total Fee',
                formatCurrency(fee.totalAmount)],
              ['Paid',
                formatCurrency(fee.paidAmount)],
              ['Balance',
                formatCurrency(fee.balanceAmount),
                'text-red-600 font-bold'],
            ].map(([label, value, cls]) => (
              <div key={label}
                className="flex items-center
                  justify-between">
                <span className="text-sm
                  text-slate-500">{label}</span>
                <span className={`text-sm
                  font-semibold text-slate-700
                  ${cls || ''}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs
              font-medium text-slate-600 mb-1.5">
              Amount to Pay *
            </label>
            <input
              type="number"
              value={amount}
              onChange={e =>
                setAmount(e.target.value)}
              max={fee.balanceAmount}
              min={1}
              className="w-full px-3 py-2.5
                rounded-xl border border-slate-200
                text-sm text-slate-700 bg-white
                outline-none focus:border-blue-400
                focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Method */}
          <div>
            <label className="block text-xs
              font-medium text-slate-600 mb-1.5">
              Payment Method *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'ONLINE',
                  label: '💳 Online' },
                { value: 'CHALLAN',
                  label: '🏦 Challan' },
                { value: 'INSTALLMENT',
                  label: '📅 Installment' },
              ].map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() =>
                    setMethod(m.value)}
                  className={`py-2.5 rounded-xl
                    text-sm font-medium
                    border transition-all
                    ${method === m.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction ID */}
          {method === 'ONLINE' && (
            <div>
              <label className="block text-xs
                font-medium text-slate-600 mb-1.5">
                Transaction ID
              </label>
              <input
                type="text"
                value={txnId}
                onChange={e =>
                  setTxnId(e.target.value)}
                placeholder="TXN123456"
                className="w-full px-3 py-2.5
                  rounded-xl border border-slate-200
                  text-sm text-slate-700 bg-white
                  outline-none
                  focus:border-blue-400"
              />
            </div>
          )}

          {/* Remarks */}
          <div>
            <label className="block text-xs
              font-medium text-slate-600 mb-1.5">
              Remarks
            </label>
            <input
              type="text"
              value={remarks}
              onChange={e =>
                setRemarks(e.target.value)}
              placeholder="Optional note"
              className="w-full px-3 py-2.5
                rounded-xl border border-slate-200
                text-sm text-slate-700 bg-white
                outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center
          justify-end gap-3 p-5
          border-t border-slate-100">
          <button onClick={onClose}
            className="px-4 py-2 text-sm
              font-medium text-slate-600
              hover:bg-slate-100 rounded-xl
              transition-colors">
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={loading}
            className="flex items-center gap-2
              px-5 py-2 bg-blue-600
              hover:bg-blue-700
              disabled:bg-blue-400 text-white
              text-sm font-semibold rounded-xl
              transition-colors">
            {loading
              ? <><Loader2 size={16}
                  className="animate-spin" />
                  Processing...</>
              : `Pay ${formatCurrency(amount)}`}
          </button>
        </div>
      </div>
    </div>
  )
}