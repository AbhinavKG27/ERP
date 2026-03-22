import { useState } from 'react'
import { useQuery, useQueryClient }
  from '@tanstack/react-query'
import {
  Home, Plus, Building2,
  Users, Wrench, CheckCircle,
  BedDouble
} from 'lucide-react'
import { hostelApi } from '../../api/hostelApi'
import { studentApi } from '../../api/studentApi'
import useAuthStore from '../../store/authStore'
import { ROLES, ACADEMIC_YEARS }
  from '../../utils/constants'
import { getInitials, formatDate }
  from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function HostelPage() {
  const { user } = useAuthStore()
  const isStudent = user?.role === ROLES.STUDENT
  const isWarden  =
    user?.role === ROLES.HOSTEL_WARDEN
  const isAdmin   = user?.role === ROLES.ADMIN

  const [tab, setTab] = useState('blocks')
  const [academicYear, setAcademicYear] =
    useState('2025-26')
  const [selectedBlock, setSelectedBlock] =
    useState(null)
  const [showAddBlock, setShowAddBlock] =
    useState(false)
  const queryClient = useQueryClient()

  // Blocks
  const { data: blocks = [], isLoading } =
    useQuery({
      queryKey: ['hostel-blocks'],
      queryFn:  () =>
        hostelApi.getBlocks()
          .then(r => r.data?.data || []),
    })

  // Rooms for selected block
  const { data: rooms = [] } = useQuery({
    queryKey: ['hostel-rooms', selectedBlock],
    queryFn:  () =>
      hostelApi.getRooms(selectedBlock)
        .then(r => r.data?.data || []),
    enabled: !!selectedBlock,
  })

  // Open maintenance requests
  const { data: openRequests = [] } = useQuery({
    queryKey: ['maintenance-open'],
    queryFn:  () =>
      hostelApi.getOpenRequests()
        .then(r => r.data?.data || []),
    enabled: isAdmin || isWarden,
  })

  // Student own room
  const { data: myStudent } = useQuery({
    queryKey: ['my-student-hostel', user?.id],
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

  const { data: myRoom } = useQuery({
    queryKey: ['my-room',
      myStudent?.id, academicYear],
    queryFn:  () =>
      hostelApi.getStudentRoom(
        myStudent.id, academicYear)
        .then(r => r.data?.data || null)
        .catch(() => null),
    enabled: isStudent && !!myStudent?.id,
  })

  const totalCapacity = blocks.reduce(
    (a, b) => a + (b.totalRooms || 0), 0)

  const tabs = [
    { id: 'blocks', label: 'Blocks & Rooms' },
    { id: 'maintenance',
      label: `Maintenance (${openRequests.length})` },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center
        justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold
            text-slate-800">Hostel</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isStudent
              ? 'Your room details'
              : 'Manage hostel blocks and rooms'}
          </p>
        </div>
        {(isAdmin || isWarden) && (
          <button
            onClick={() => setShowAddBlock(true)}
            className="flex items-center gap-2
              px-4 py-2.5 bg-blue-600
              hover:bg-blue-700 text-white
              text-sm font-semibold rounded-xl
              transition-colors shadow-sm">
            <Plus size={18} />
            Add Block
          </button>
        )}
      </div>

      {/* Student View */}
      {isStudent && (
        <div className="space-y-4">
          {!myRoom && (
            <div className="bg-white rounded-2xl
              border border-slate-100 shadow-sm
              p-12 text-center">
              <Home size={40}
                className="text-slate-200
                  mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                No room allotted for {academicYear}
              </p>
            </div>
          )}
          {myRoom && (
            <div className="bg-gradient-to-r
              from-blue-600 to-indigo-600
              rounded-2xl p-6">
              <p className="text-blue-200 text-sm
                font-medium">Your Room</p>
              <h2 className="text-3xl font-bold
                text-white mt-1">
                Room {myRoom.roomNumber}
              </h2>
              <p className="text-blue-200 mt-1">
                {myRoom.blockName} Block
              </p>
              <div className="mt-4 grid
                grid-cols-3 gap-4">
                {[
                  ['Allotted',
                    formatDate(
                      myRoom.allotmentDate)],
                  ['Status', myRoom.status],
                  ['Year', academicYear],
                ].map(([k, v]) => (
                  <div key={k}
                    className="bg-white/10
                      rounded-xl p-3">
                    <p className="text-blue-200
                      text-xs">{k}</p>
                    <p className="text-white
                      text-sm font-semibold mt-0.5">
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admin/Warden View */}
      {!isStudent && (
        <div className="space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2
            sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Blocks',
                value: blocks.length,
                color: 'text-blue-600' },
              { label: 'Total Rooms',
                value: totalCapacity,
                color: 'text-violet-600' },
              { label: 'Male Blocks',
                value: blocks.filter(b =>
                  b.gender === 'MALE').length,
                color: 'text-blue-600' },
              { label: 'Female Blocks',
                value: blocks.filter(b =>
                  b.gender === 'FEMALE').length,
                color: 'text-pink-600' },
            ].map(s => (
              <div key={s.label}
                className="bg-white rounded-xl
                  p-4 border border-slate-100
                  shadow-sm">
                <p className="text-sm
                  text-slate-500">{s.label}</p>
                <p className={`text-2xl font-bold
                  mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1
            bg-slate-100 rounded-xl w-fit">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg
                  text-sm font-medium
                  transition-all
                  ${tab === t.id
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Blocks Tab */}
          {tab === 'blocks' && (
            <div className="space-y-4">
              {isLoading && (
                <div className="text-center py-8
                  text-slate-400 text-sm">
                  Loading blocks...
                </div>
              )}
              {blocks.length === 0
                && !isLoading && (
                <div className="bg-white
                  rounded-2xl border border-slate-100
                  shadow-sm p-12 text-center">
                  <Building2 size={40}
                    className="text-slate-200
                      mx-auto mb-3" />
                  <p className="text-slate-400
                    text-sm">
                    No blocks added yet
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1
                sm:grid-cols-2 lg:grid-cols-3
                gap-4">
                {blocks.map(block => (
                  <div key={block.id}
                    className="bg-white rounded-2xl
                      border border-slate-100
                      shadow-sm p-5
                      hover:shadow-md
                      transition-shadow
                      cursor-pointer"
                    onClick={() => {
                      setSelectedBlock(block.id)
                      setTab('rooms-' + block.id)
                    }}>
                    <div className="flex items-start
                      justify-between">
                      <div className="w-12 h-12
                        rounded-xl bg-blue-50
                        flex items-center
                        justify-center">
                        <Building2 size={22}
                          className="text-blue-600" />
                      </div>
                      <span className={`px-2.5
                        py-0.5 rounded-lg text-xs
                        font-semibold
                        ${block.gender === 'MALE'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-pink-50 text-pink-700'}`}>
                        {block.gender}
                      </span>
                    </div>
                    <h3 className="text-base
                      font-bold text-slate-800 mt-3">
                      {block.name}
                    </h3>
                    <p className="text-sm
                      text-slate-500 mt-1">
                      {block.totalRooms} Rooms
                    </p>
                    {block.wardenName && (
                      <p className="text-xs
                        text-slate-400 mt-1">
                        Warden: {block.wardenName}
                      </p>
                    )}
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        setSelectedBlock(block.id)
                      }}
                      className="mt-3 text-blue-600
                        text-xs font-medium
                        hover:underline">
                      View Rooms →
                    </button>
                  </div>
                ))}
              </div>

              {/* Rooms for selected block */}
              {selectedBlock && (
                <div className="bg-white
                  rounded-2xl border border-slate-100
                  shadow-sm overflow-hidden">
                  <div className="p-4 border-b
                    border-slate-100 flex items-center
                    justify-between">
                    <h2 className="text-base
                      font-semibold text-slate-700">
                      Rooms —{' '}
                      {blocks.find(b =>
                        b.id === selectedBlock)
                        ?.name}
                    </h2>
                    <button
                      onClick={() =>
                        setSelectedBlock(null)}
                      className="text-xs
                        text-slate-400
                        hover:text-slate-600">
                      ✕ Close
                    </button>
                  </div>
                  <div className="grid grid-cols-2
                    sm:grid-cols-3 lg:grid-cols-4
                    gap-3 p-4">
                    {rooms.map(room => (
                      <div key={room.id}
                        className={`rounded-xl p-3
                          border text-center
                          ${room.isAvailable
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-red-50 border-red-200'}`}>
                        <BedDouble size={20}
                          className={`mx-auto mb-1
                            ${room.isAvailable
                              ? 'text-emerald-500'
                              : 'text-red-400'}`}
                        />
                        <p className="text-sm
                          font-bold text-slate-800">
                          {room.roomNumber}
                        </p>
                        <p className="text-xs
                          text-slate-500 mt-0.5">
                          {room.roomType}
                        </p>
                        <p className="text-xs
                          mt-1 font-semibold
                          ${room.isAvailable
                            ? 'text-emerald-600'
                            : 'text-red-600'}">
                          {room.occupiedCount}/
                          {room.capacity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Maintenance Tab */}
          {tab === 'maintenance' && (
            <div className="bg-white rounded-2xl
              border border-slate-100 shadow-sm
              overflow-hidden">
              <div className="p-4 border-b
                border-slate-100">
                <h2 className="text-base
                  font-semibold text-slate-700">
                  Open Maintenance Requests
                </h2>
              </div>
              {openRequests.length === 0 && (
                <div className="p-12 text-center">
                  <CheckCircle size={40}
                    className="text-emerald-200
                      mx-auto mb-3" />
                  <p className="text-slate-400
                    text-sm">
                    No open maintenance requests
                  </p>
                </div>
              )}
              <div className="divide-y
                divide-slate-50">
                {openRequests.map(req => (
                  <div key={req.id}
                    className="flex items-start
                      gap-4 p-4">
                    <div className="w-10 h-10
                      rounded-xl bg-orange-50
                      flex items-center
                      justify-center flex-shrink-0">
                      <Wrench size={18}
                        className="text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center
                        gap-2 flex-wrap">
                        <p className="text-sm
                          font-semibold
                          text-slate-800">
                          {req.studentName}
                        </p>
                        <span className="px-2 py-0.5
                          bg-orange-50
                          text-orange-700
                          text-xs rounded-lg
                          font-medium">
                          {req.issueType}
                        </span>
                      </div>
                      <p className="text-xs
                        text-slate-500 mt-1">
                        Room {req.roomNumber} •
                        {req.description}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await hostelApi
                            .resolveRequest(req.id)
                          queryClient.invalidateQueries(
                            ['maintenance-open'])
                          toast.success(
                            'Request resolved!')
                        } catch {
                          toast.error(
                            'Failed to resolve')
                        }
                      }}
                      className="px-3 py-1.5
                        bg-emerald-600
                        hover:bg-emerald-700
                        text-white text-xs
                        font-semibold rounded-lg
                        transition-colors
                        flex-shrink-0">
                      Resolve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Block Modal */}
      {showAddBlock && (
        <AddBlockModal
          onClose={() => setShowAddBlock(false)}
          onSuccess={() => {
            setShowAddBlock(false)
            queryClient.invalidateQueries(
              ['hostel-blocks'])
            toast.success('Block added!')
          }}
        />
      )}
    </div>
  )
}

function AddBlockModal({ onClose, onSuccess }) {
  const [name,    setName]    = useState('')
  const [gender,  setGender]  = useState('MALE')
  const [rooms,   setRooms]   = useState(20)
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!name) {
      toast.error('Block name is required')
      return
    }
    setLoading(true)
    try {
      await hostelApi.createBlock({
        name, gender,
        totalRooms: Number(rooms),
      })
      onSuccess()
    } catch (err) {
      toast.error(
        err?.response?.data?.message
        || 'Failed to add block')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50
      backdrop-blur-sm z-50 flex items-center
      justify-center p-4">
      <div className="bg-white rounded-2xl
        w-full max-w-sm shadow-2xl">
        <div className="flex items-center
          justify-between p-5
          border-b border-slate-100">
          <h2 className="text-base font-bold
            text-slate-800">Add Hostel Block</h2>
          <button onClick={onClose}
            className="p-2 hover:bg-slate-100
              rounded-lg transition-colors">
            <Home size={18}
              className="text-slate-400" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs
              font-medium text-slate-600 mb-1.5">
              Block Name *
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Block A"
              className="w-full px-3 py-2.5
                rounded-xl border border-slate-200
                text-sm text-slate-700 outline-none
                focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs
              font-medium text-slate-600 mb-1.5">
              Gender *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['MALE', 'FEMALE'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2.5 rounded-xl
                    text-sm font-medium border
                    transition-all
                    ${gender === g
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200'}`}>
                  {g === 'MALE' ? '👨 Male' : '👩 Female'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs
              font-medium text-slate-600 mb-1.5">
              Total Rooms *
            </label>
            <input
              type="number"
              value={rooms}
              onChange={e => setRooms(e.target.value)}
              min={1}
              className="w-full px-3 py-2.5
                rounded-xl border border-slate-200
                text-sm text-slate-700 outline-none
                focus:border-blue-400"
            />
          </div>
        </div>
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
            onClick={handleAdd}
            disabled={loading}
            className="flex items-center gap-2
              px-5 py-2 bg-blue-600
              hover:bg-blue-700
              disabled:bg-blue-400 text-white
              text-sm font-semibold rounded-xl
              transition-colors">
            {loading ? 'Adding...' : 'Add Block'}
          </button>
        </div>
      </div>
    </div>
  )
}