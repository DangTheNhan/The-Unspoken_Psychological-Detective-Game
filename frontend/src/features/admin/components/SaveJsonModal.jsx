import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { formatVietnamDateTime } from '@/shared/time/vietnamTime'

/**
 * Hộp thoại xem chi tiết tiến trình điều tra và Sổ tay của người chơi.
 * Liên kết trực tiếp với Danh mục Chứng cứ (evidenceCatalog) để hiển thị ảnh, tên tiếng Việt và mô tả.
 */
export function SaveJsonModal({ saveDetail, evidenceCatalog = [], onClose, returnFocusRef }) {
  const [viewMode, setViewMode] = useState('structured')
  const dialogRef = useRef(null)
  const titleId = useId()
  const isOpen = Boolean(saveDetail)

  useEffect(() => {
    if (!isOpen) return undefined
    const dialog = dialogRef.current
    const opener = returnFocusRef?.current || document.activeElement
    dialog.showModal()
    return () => {
      dialog.close()
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus()
    }
  }, [isOpen, returnFocusRef])

  const evidenceByCode = useMemo(() => {
    const map = new Map()
    for (const item of evidenceCatalog) {
      if (item?.evidenceCode) {
        map.set(item.evidenceCode, item)
      }
    }
    return map
  }, [evidenceCatalog])

  const parsed = useMemo(() => {
    if (!saveDetail?.saveDataJson) return { ok: false, error: 'Chưa có dữ liệu sổ tay', data: null }
    try {
      const data = JSON.parse(saveDetail.saveDataJson)
      return { ok: true, error: null, data }
    } catch (err) {
      return { ok: false, error: err.message, data: null }
    }
  }, [saveDetail])

  if (!saveDetail) return null

  const stateObj = parsed.data?.state ?? parsed.data ?? {}
  const notebookSummary = extractNotebookSummary(stateObj)

  return (
    <dialog
      ref={dialogRef}
      className="admin-save-dialog"
      aria-labelledby={titleId}
      aria-modal="true"
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const controls = [
          ...event.currentTarget.querySelectorAll('button:not(:disabled), [href], [tabindex="0"]'),
        ].filter((element) => element.getClientRects().length)
        const first = controls[0]
        const last = controls.at(-1)
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded border border-[var(--admin-line)] bg-[var(--admin-surface-soft)] text-[var(--admin-ink)] shadow-sm">
        <header className="flex items-center justify-between border-b border-[var(--admin-line)] bg-[var(--admin-surface)] px-6 py-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--admin-accent)]">
              Hồ sơ tiến trình điều tra #{saveDetail.saveId}
            </span>
            <h2 id={titleId} className="mt-0.5 text-lg font-bold">
              Thám tử: {saveDetail.username}{' '}
              <span className="text-xs font-normal text-[var(--admin-muted)]">
                ({saveDetail.email})
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[var(--admin-line)] px-3 py-1 text-xs font-medium text-[var(--admin-muted)] hover:border-[var(--admin-accent-border)] hover:text-[var(--admin-accent)]"
          >
            Đóng
          </button>
        </header>

        <div className="grid grid-cols-2 gap-3 border-b border-[var(--admin-line)] bg-[var(--admin-surface)] px-6 py-3 text-xs sm:grid-cols-4">
          <div>
            <span className="text-[var(--admin-muted)]">Chương hiện tại:</span>
            <p className="mt-0.5 text-sm font-semibold text-[var(--admin-accent)]">
              Chương {saveDetail.currentChapter}
            </p>
          </div>
          <div>
            <span className="text-[var(--admin-muted)]">Điểm uy tín:</span>
            <p className="mt-0.5 text-sm font-semibold text-[var(--admin-success)]">
              {saveDetail.credibilityScore} / 100
            </p>
          </div>
          <div>
            <span className="text-[var(--admin-muted)]">Trạng thái bản lưu:</span>
            <p
              className={`mt-0.5 text-sm font-semibold ${
                parsed.ok ? 'text-[var(--admin-success)]' : 'text-[var(--admin-danger)]'
              }`}
            >
              {parsed.ok ? 'Toàn vẹn' : 'Dữ liệu lỗi'}
            </p>
          </div>
          <div>
            <span className="text-[var(--admin-muted)]">Cập nhật lần cuối (giờ Việt Nam):</span>
            <p className="mt-0.5 text-sm text-[var(--admin-ink)]">
              {formatVietnamDateTime(saveDetail.updatedAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-[var(--admin-line)] px-6 py-2.5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode('structured')}
              aria-pressed={viewMode === 'structured'}
              className={`rounded px-3.5 py-1.5 text-xs font-medium transition ${
                viewMode === 'structured'
                  ? 'bg-[var(--admin-accent)] font-semibold text-[var(--admin-on-accent)]'
                  : 'border border-[var(--admin-line)] text-[var(--admin-muted)] hover:text-[var(--admin-ink)]'
              }`}
            >
              Sổ tay điều tra (4 mục)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              aria-pressed={viewMode === 'raw'}
              className={`rounded px-3.5 py-1.5 text-xs font-medium transition ${
                viewMode === 'raw'
                  ? 'bg-[var(--admin-accent)] font-semibold text-[var(--admin-on-accent)]'
                  : 'border border-[var(--admin-line)] text-[var(--admin-muted)] hover:text-[var(--admin-ink)]'
              }`}
            >
              Chi tiết kỹ thuật
            </button>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto p-6"
          tabIndex={0}
          role="region"
          aria-label="Nội dung sổ tay"
        >
          {!parsed.ok ? (
            <div className="rounded border border-[var(--admin-danger-border)] bg-[var(--admin-danger-wash)] p-4 text-xs text-[var(--admin-danger)]">
              Không thể đọc dữ liệu sổ tay: {parsed.error}
            </div>
          ) : viewMode === 'structured' ? (
            <div className="space-y-5">
              {/* Khối Vật chứng đã thu thập — Liên kết trực tiếp với Danh mục Chứng cứ */}
              <div className="rounded border border-[var(--admin-line)] bg-[var(--admin-surface)] p-4">
                <div className="flex items-center justify-between border-b border-[var(--admin-line)] pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--admin-accent)]">
                    Vật chứng đã thu thập trong Sổ tay
                  </span>
                  <span className="rounded bg-[var(--admin-accent-wash)] px-2 py-0.5 font-mono text-xs font-bold text-[var(--admin-accent)]">
                    {notebookSummary.evidence.length} vật chứng
                  </span>
                </div>

                {notebookSummary.evidence.length === 0 ? (
                  <p className="mt-3 text-xs text-[var(--admin-subtle)] italic">
                    Người chơi chưa thu thập vật chứng nào.
                  </p>
                ) : (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {notebookSummary.evidence.map((code) => {
                      const catalogItem = evidenceByCode.get(code)
                      return (
                        <div
                          key={code}
                          className="flex gap-3 rounded border border-[var(--admin-line)] bg-[var(--admin-surface-soft)] p-3"
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded border border-[var(--admin-line)] bg-[var(--admin-surface)]">
                            {catalogItem?.imageUrl ? (
                              <img
                                src={catalogItem.imageUrl}
                                alt={catalogItem.evidenceName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--admin-subtle)]">
                                Không ảnh
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-xs font-bold text-[var(--admin-ink)]">
                                {catalogItem?.evidenceName || code}
                              </span>
                              <span className="shrink-0 font-mono text-[10px] text-[var(--admin-accent)]">
                                {code}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[var(--admin-muted)]">
                              {catalogItem?.description ||
                                'Chưa có mô tả trong Danh mục Chứng cứ (bấm nạp mẫu ở mục 04 để đồng bộ).'}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* 3 mục còn lại của Sổ tay */}
              <div className="grid gap-3 sm:grid-cols-3">
                <SummaryBox
                  title="Hồ sơ nhân vật"
                  count={notebookSummary.people.length}
                  items={notebookSummary.people}
                />
                <SummaryBox
                  title="Mốc thời gian"
                  count={notebookSummary.timeline.length}
                  items={notebookSummary.timeline}
                />
                <SummaryBox
                  title="Lời khai ghi nhận"
                  count={notebookSummary.statements.length}
                  items={notebookSummary.statements}
                />
              </div>

              <div className="rounded border border-[var(--admin-line)] bg-[var(--admin-surface)] p-4 text-xs">
                <h4 className="font-semibold text-[var(--admin-accent)]">
                  Vị trí và tiến trình hiện tại
                </h4>
                <div className="mt-2 grid gap-2 text-[var(--admin-muted)] sm:grid-cols-3">
                  <div>
                    Phân cảnh cốt truyện:{' '}
                    <strong className="text-[var(--admin-ink)]">
                      {notebookSummary.currentNodeId || 'Đang khám phá tự do'}
                    </strong>
                  </div>
                  <div>
                    Khu vực hiện tại:{' '}
                    <strong className="text-[var(--admin-ink)]">
                      {notebookSummary.roomId || 'Phòng 201'}
                    </strong>
                  </div>
                  <div>
                    Hướng dẫn tân thủ:{' '}
                    <strong className="text-[var(--admin-ink)]">
                      {notebookSummary.tutorialStep || 'Đã hoàn thành'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <pre
              tabIndex={0}
              className="max-h-96 overflow-auto rounded border border-[var(--admin-line)] bg-[var(--admin-surface-soft)] p-4 font-mono text-xs leading-relaxed text-[var(--admin-accent)]"
            >
              {JSON.stringify(parsed.data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </dialog>
  )
}

function SummaryBox({ title, count, items }) {
  return (
    <div className="rounded border border-[var(--admin-line)] bg-[var(--admin-surface)] p-3">
      <div className="flex items-center justify-between border-b border-[var(--admin-line)] pb-1.5">
        <span className="text-xs font-medium text-[var(--admin-muted)]">{title}</span>
        <span className="rounded bg-[var(--admin-accent-wash)] px-1.5 py-0.5 font-mono text-xs font-bold text-[var(--admin-accent)]">
          {count}
        </span>
      </div>
      <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-xs text-[var(--admin-ink)]">
        {items.length === 0 ? (
          <li className="text-[var(--admin-subtle)] italic">Chưa thu thập</li>
        ) : (
          items.map((id) => (
            <li
              key={id}
              className="truncate rounded bg-[var(--admin-surface-soft)] px-2 py-1 font-mono text-[11px]"
            >
              • {id}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

function extractNotebookSummary(raw) {
  const nb = raw.notebook ?? {}
  const toList = (val) => {
    if (!val) return []
    if (Array.isArray(val)) {
      return val.map((item) => (typeof item === 'string' ? item : item?.id || JSON.stringify(item)))
    }
    if (typeof val === 'object') {
      return Object.keys(val)
    }
    return []
  }

  return {
    evidence: toList(raw.evidence ?? nb.evidence ?? nb.Evidence),
    people: toList(raw.people ?? nb.people ?? nb.People),
    timeline: toList(raw.timeline ?? nb.timeline ?? nb.Timeline),
    statements: toList(raw.statements ?? nb.statements ?? nb.Statements),
    currentNodeId: raw.currentNodeId ?? raw.current_node_id ?? null,
    roomId: raw.player?.roomId ?? raw.scene_location ?? null,
    tutorialStep: raw.tutorial?.step ?? null,
  }
}
