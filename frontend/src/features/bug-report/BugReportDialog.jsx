import { useState } from 'react'
import { useAuth } from '@/features/auth/state/useAuth'
import { Modal } from '@/shared/ui/Modal'
import { submitBugReport } from './api/bugReportApi'

export function BugReportDialog({ onClose }) {
  const { session } = useAuth()
  const [content, setContent] = useState('')
  const [status, setStatus] = useState({ busy: false, error: '', sent: false })
  const send = async (event) => {
    event.preventDefault()
    if (!content.trim() || status.busy) return
    setStatus({ busy: true, error: '', sent: false })
    try {
      await submitBugReport({ userId: session.userId, reportContent: content.trim() })
      setStatus({ busy: false, error: '', sent: true })
    } catch (error) {
      setStatus({ busy: false, error: error.message, sent: false })
    }
  }
  return (
    <Modal
      title="Gửi báo lỗi"
      onClose={() => {
        if (!status.busy) onClose()
      }}
    >
      {status.sent ? (
        <div>
          <p role="status" className="text-emerald-300">
            Đã gửi báo lỗi tới quản trị viên.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 rounded bg-amber-400 px-4 py-2 text-stone-950"
          >
            Đóng
          </button>
        </div>
      ) : (
        <form onSubmit={send} className="space-y-4">
          <p className="text-sm text-stone-400">
            Mô tả thao tác bạn vừa làm, điều bạn mong đợi và lỗi đã xảy ra.
          </p>
          <label className="block text-sm">
            Nội dung báo lỗi
            <textarea
              required
              maxLength={10000}
              rows={6}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="mt-2 w-full rounded border border-stone-600 bg-[#17151b] p-3 text-sm focus:border-amber-400 focus:outline-none"
            />
          </label>
          {status.error && (
            <p role="alert" className="text-sm text-red-300">
              {status.error}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              disabled={status.busy}
              onClick={onClose}
              className="rounded border border-stone-600 px-4 py-2 text-sm"
            >
              Hủy
            </button>
            <button
              disabled={status.busy || !content.trim()}
              className="rounded bg-amber-400 px-4 py-2 text-sm text-stone-950 disabled:opacity-50"
            >
              {status.busy ? 'Đang gửi…' : 'Gửi báo lỗi'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
