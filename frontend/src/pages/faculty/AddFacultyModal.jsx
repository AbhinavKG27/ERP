import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2, UserCheck } from 'lucide-react'
import { facultyApi } from '../../api/facultyApi'

const schema = z.object({
  fullName:       z.string().min(2),
  email:          z.string().email(),
  employeeId:     z.string().min(2),
  departmentId:   z.coerce.number().min(1),
  designation:    z.string().min(2),
  specialization: z.string().optional(),
  qualification:  z.string().min(2),
  phone:          z.string().min(10),
  joiningDate:    z.string().min(1),
})

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-medium
      text-slate-600 mb-1">{label}</label>
    {children}
    {error && (
      <p className="text-red-500 text-xs mt-1">
        {error}
      </p>
    )}
  </div>
)

const inputCls = (err) =>
  `w-full px-3 py-2 rounded-lg border text-sm
   text-slate-700 bg-white outline-none transition-all
   placeholder-slate-300 focus:ring-2
   focus:ring-blue-500/20 focus:border-blue-400
   ${err ? 'border-red-300' : 'border-slate-200'}`

export default function AddFacultyModal({
  departments, onClose, onSuccess
}) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await facultyApi.create(data)
      onSuccess()
    } catch (err) {
      alert(err?.response?.data?.message
        || 'Failed to create faculty')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50
      backdrop-blur-sm z-50 flex items-center
      justify-center p-4">
      <div className="bg-white rounded-2xl w-full
        max-w-xl max-h-[90vh] overflow-hidden
        flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center
          justify-between p-5
          border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl
              bg-violet-50 flex items-center
              justify-center">
              <UserCheck size={20}
                className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-base font-bold
                text-slate-800">
                Add Faculty Member
              </h2>
              <p className="text-xs text-slate-400">
                Fill in faculty details
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

        {/* Form */}
        <div className="overflow-y-auto flex-1 p-5">
          <form id="add-faculty-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name *"
                error={errors.fullName?.message}>
                <input {...register('fullName')}
                  placeholder="Dr. John Doe"
                  className={inputCls(errors.fullName)} />
              </Field>
              <Field label="Email *"
                error={errors.email?.message}>
                <input {...register('email')}
                  type="email"
                  placeholder="john@apex.edu"
                  className={inputCls(errors.email)} />
              </Field>
              <Field label="Employee ID *"
                error={errors.employeeId?.message}>
                <input {...register('employeeId')}
                  placeholder="FAC002"
                  className={
                    inputCls(errors.employeeId)} />
              </Field>
              <Field label="Department *"
                error={errors.departmentId?.message}>
                <select {...register('departmentId')}
                  className={
                    inputCls(errors.departmentId)}>
                  <option value="">
                    Select department
                  </option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Designation *"
                error={errors.designation?.message}>
                <select {...register('designation')}
                  className={
                    inputCls(errors.designation)}>
                  <option value="">Select</option>
                  {[
                    'Professor',
                    'Associate Professor',
                    'Assistant Professor',
                    'HOD',
                    'Lecturer',
                  ].map(d => (
                    <option key={d} value={d}>{d}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Qualification *"
                error={errors.qualification?.message}>
                <input {...register('qualification')}
                  placeholder="Ph.D Computer Science"
                  className={
                    inputCls(errors.qualification)} />
              </Field>
              <Field label="Specialization"
                error={
                  errors.specialization?.message}>
                <input {...register('specialization')}
                  placeholder="Machine Learning"
                  className={inputCls(
                    errors.specialization)} />
              </Field>
              <Field label="Phone *"
                error={errors.phone?.message}>
                <input {...register('phone')}
                  placeholder="9876543210"
                  className={inputCls(errors.phone)} />
              </Field>
              <div className="col-span-2">
                <Field label="Joining Date *"
                  error={errors.joiningDate?.message}>
                  <input {...register('joiningDate')}
                    type="date"
                    className={inputCls(
                      errors.joiningDate)} />
                </Field>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center
          justify-end gap-3 p-5
          border-t border-slate-100 bg-slate-50/50">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-medium
              text-slate-600 hover:bg-slate-100
              rounded-xl transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            form="add-faculty-form"
            disabled={loading}
            className="flex items-center gap-2
              px-5 py-2 bg-violet-600
              hover:bg-violet-700
              disabled:bg-violet-400 text-white
              text-sm font-semibold rounded-xl
              transition-colors">
            {loading
              ? <><Loader2 size={16}
                  className="animate-spin" />
                  Saving...</>
              : 'Add Faculty'}
          </button>
        </div>
      </div>
    </div>
  )
}