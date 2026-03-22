import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2, GraduationCap } from 'lucide-react'
import { studentApi } from '../../api/studentApi'

const schema = z.object({
  fullName:       z.string().min(2, 'Name is required'),
  email:          z.string().email('Invalid email'),
  rollNumber:     z.string().min(3, 'Roll number required'),
  registerNumber: z.string().min(3, 'Register number required'),
  batchId:        z.coerce.number().min(1, 'Batch required'),
  phone:          z.string().min(10, 'Phone required'),
  gender:         z.enum(['MALE', 'FEMALE', 'OTHER']),
  dateOfBirth:    z.string().min(1, 'DOB required'),
  bloodGroup:     z.string().optional(),
  address:        z.string().min(5, 'Address required'),
  parentName:     z.string().min(2, 'Parent name required'),
  parentPhone:    z.string().min(10, 'Parent phone required'),
  parentEmail:    z.string().email('Invalid parent email')
                    .optional().or(z.literal('')),
  admissionDate:  z.string().min(1, 'Admission date required'),
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

const Input = ({ error, ...props }) => (
  <input
    {...props}
    className={`w-full px-3 py-2 rounded-lg border
      text-sm text-slate-700 bg-white outline-none
      transition-all placeholder-slate-300
      focus:ring-2 focus:ring-blue-500/20
      focus:border-blue-400
      ${error
        ? 'border-red-300'
        : 'border-slate-200'}`}
  />
)

const Select = ({ error, children, ...props }) => (
  <select
    {...props}
    className={`w-full px-3 py-2 rounded-lg border
      text-sm text-slate-700 bg-white outline-none
      transition-all focus:ring-2
      focus:ring-blue-500/20 focus:border-blue-400
      ${error
        ? 'border-red-300'
        : 'border-slate-200'}`}>
    {children}
  </select>
)

export default function AddStudentModal({
  onClose, onSuccess
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
      await studentApi.create(data)
      onSuccess()
    } catch (err) {
      const msg = err?.response?.data?.message
        || 'Failed to create student'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50
      backdrop-blur-sm z-50 flex items-center
      justify-center p-4">
      <div className="bg-white rounded-2xl w-full
        max-w-2xl max-h-[90vh] overflow-hidden
        flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between
          p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl
              bg-blue-50 flex items-center justify-center">
              <GraduationCap size={20}
                className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold
                text-slate-800">Add New Student</h2>
              <p className="text-xs text-slate-400">
                Fill in student details below
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 hover:bg-slate-100
              rounded-lg transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 p-6">
          <form id="add-student-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6">

            {/* Personal Info */}
            <div>
              <h3 className="text-xs font-semibold
                text-slate-400 uppercase tracking-wider
                mb-3">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name *"
                  error={errors.fullName?.message}>
                  <Input {...register('fullName')}
                    placeholder="John Doe"
                    error={errors.fullName} />
                </Field>
                <Field label="Email *"
                  error={errors.email?.message}>
                  <Input {...register('email')}
                    type="email"
                    placeholder="john@student.apex.edu"
                    error={errors.email} />
                </Field>
                <Field label="Date of Birth *"
                  error={errors.dateOfBirth?.message}>
                  <Input {...register('dateOfBirth')}
                    type="date"
                    error={errors.dateOfBirth} />
                </Field>
                <Field label="Gender *"
                  error={errors.gender?.message}>
                  <Select {...register('gender')}
                    error={errors.gender}>
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </Select>
                </Field>
                <Field label="Phone *"
                  error={errors.phone?.message}>
                  <Input {...register('phone')}
                    placeholder="9876543210"
                    error={errors.phone} />
                </Field>
                <Field label="Blood Group"
                  error={errors.bloodGroup?.message}>
                  <Select {...register('bloodGroup')}>
                    <option value="">Select</option>
                    {['A+','A-','B+','B-',
                      'O+','O-','AB+','AB-'].map(bg => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </Select>
                </Field>
                <div className="col-span-2">
                  <Field label="Address *"
                    error={errors.address?.message}>
                    <Input {...register('address')}
                      placeholder="123 Main Street, City"
                      error={errors.address} />
                  </Field>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div>
              <h3 className="text-xs font-semibold
                text-slate-400 uppercase tracking-wider
                mb-3">Academic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Roll Number *"
                  error={errors.rollNumber?.message}>
                  <Input {...register('rollNumber')}
                    placeholder="CSE2024001"
                    error={errors.rollNumber} />
                </Field>
                <Field label="Register Number *"
                  error={errors.registerNumber?.message}>
                  <Input {...register('registerNumber')}
                    placeholder="RA2411003010001"
                    error={errors.registerNumber} />
                </Field>
                <Field label="Batch ID *"
                  error={errors.batchId?.message}>
                  <Input {...register('batchId')}
                    type="number"
                    placeholder="1"
                    error={errors.batchId} />
                </Field>
                <Field label="Admission Date *"
                  error={errors.admissionDate?.message}>
                  <Input {...register('admissionDate')}
                    type="date"
                    error={errors.admissionDate} />
                </Field>
              </div>
            </div>

            {/* Parent Info */}
            <div>
              <h3 className="text-xs font-semibold
                text-slate-400 uppercase tracking-wider
                mb-3">Parent / Guardian</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Parent Name *"
                  error={errors.parentName?.message}>
                  <Input {...register('parentName')}
                    placeholder="Parent Full Name"
                    error={errors.parentName} />
                </Field>
                <Field label="Parent Phone *"
                  error={errors.parentPhone?.message}>
                  <Input {...register('parentPhone')}
                    placeholder="9876543211"
                    error={errors.parentPhone} />
                </Field>
                <div className="col-span-2">
                  <Field label="Parent Email"
                    error={errors.parentEmail?.message}>
                    <Input {...register('parentEmail')}
                      type="email"
                      placeholder="parent@gmail.com"
                      error={errors.parentEmail} />
                  </Field>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center
          justify-end gap-3 p-6
          border-t border-slate-100 bg-slate-50/50">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-medium
              text-slate-600 hover:bg-slate-100
              rounded-xl transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            form="add-student-form"
            disabled={loading}
            className="flex items-center gap-2
              px-5 py-2 bg-blue-600 hover:bg-blue-700
              disabled:bg-blue-400 text-white
              text-sm font-semibold rounded-xl
              transition-colors shadow-sm
              shadow-blue-500/25">
            {loading
              ? <><Loader2 size={16}
                  className="animate-spin" />
                  Saving...</>
              : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  )
}