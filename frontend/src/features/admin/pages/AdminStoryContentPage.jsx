import { useEffect, useMemo, useRef, useState } from 'react'
import * as api from '../api/storyContentApi'
import { storyTextKey } from '@/game/narrative/storyText'
import './storyContent.css'

const indexEdits = (entries) => Object.fromEntries(entries.map((e) => [storyTextKey(e), e]))
const signature = (entries) => JSON.stringify(entries.map((e) => [storyTextKey(e), e.value]).sort())
const readable = (text) => String(text ?? '').replaceAll('**', '')
const timeLabel = (value) => (value ? String(value).replace('T', ' ').slice(0, 19) : '—')

async function readWorkspace(chapter, chapters) {
  const [nodes, draft, versions] = await Promise.all([
    api.fetchNodes(chapter.chapterId),
    api.fetchDraft(chapter.chapterId),
    api.fetchVersions(chapter.chapterId),
  ])
  const published =
    draft.publishedVersionId === null
      ? null
      : await api.fetchVersion(chapter.chapterId, draft.publishedVersionId)
  return { chapter, chapters, nodes, draft, versions, published }
}

export function AdminStoryContentPage() {
  const [workspace, setWorkspace] = useState(null)
  const [edits, setEdits] = useState({})
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [editableOnly, setEditableOnly] = useState(true)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [validation, setValidation] = useState(null)
  const [preview, setPreview] = useState(null)
  const [reviewed, setReviewed] = useState(false)
  const [history, setHistory] = useState(null)
  const [restarted, setRestarted] = useState(false)
  const alive = useRef(false)
  const request = useRef(0)

  useEffect(() => {
    alive.current = true
    const ticket = ++request.current
    api
      .fetchChapters()
      .then(async (chapters) => {
        if (!chapters.length) throw new Error('Chưa có chương được đăng ký.')
        return readWorkspace(chapters[0], chapters)
      })
      .then((data) => {
        if (!alive.current || ticket !== request.current) return
        setWorkspace(data)
        setEdits(indexEdits(data.draft.overrides))
        setSelectedId(data.nodes.find((n) => n.fields.length)?.nodeId ?? null)
      })
      .catch((err) => {
        if (alive.current && ticket === request.current) setError(err.message)
      })
    return () => {
      alive.current = false
    }
  }, [])

  const currentOverrides = Object.values(edits)
  const dirty = workspace && signature(currentOverrides) !== signature(workspace.draft.overrides)
  const incompatible =
    workspace && workspace.draft.baseHash !== workspace.chapter.baseHash && !restarted
  const nodes = workspace?.nodes
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (nodes ?? []).filter((n) => {
      if (editableOnly && !n.fields.length) return false
      if (typeFilter && n.type !== typeFilter) return false
      const text = n.fields
        .map((f) => `${f.baseText} ${edits[storyTextKey({ nodeId: n.nodeId, ...f })]?.value ?? ''}`)
        .join(' ')
      return !q || `${n.nodeId} ${n.type} ${n.speaker} ${text}`.toLowerCase().includes(q)
    })
  }, [nodes, edits, query, typeFilter, editableOnly])
  const selected = nodes?.find((n) => n.nodeId === selectedId)
  const publishedEdits = indexEdits(workspace?.published?.overrides ?? [])

  useEffect(() => {
    if (!dirty) return undefined
    const warn = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    const beforeNavigation = (event) => {
      const link = event.target.closest?.('a[href]')
      if (link && !window.confirm('Bạn có thay đổi chưa lưu. Rời trang và bỏ thay đổi?'))
        event.preventDefault()
    }
    document.addEventListener('click', beforeNavigation, true)
    return () => {
      window.removeEventListener('beforeunload', warn)
      document.removeEventListener('click', beforeNavigation, true)
    }
  }, [dirty])

  function invalidateReview() {
    setValidation(null)
    setPreview(null)
    setReviewed(false)
    setNotice('')
    setHistory(null)
  }
  function updateText(node, field, value) {
    const target = {
      nodeId: node.nodeId,
      field: field.field,
      ...(field.choiceIndex === undefined ? {} : { choiceIndex: field.choiceIndex }),
    }
    setEdits((previous) => {
      const next = { ...previous }
      const key = storyTextKey(target)
      if (value === field.baseText) delete next[key]
      else next[key] = { ...target, value }
      return next
    })
    invalidateReview()
  }
  async function act(label, action) {
    if (busy) return
    setBusy(label)
    setError('')
    setNotice('')
    try {
      await action()
    } catch (err) {
      if (alive.current) setError(err.message)
    } finally {
      if (alive.current) setBusy('')
    }
  }
  async function reload(id = workspace?.chapter.chapterId) {
    if (dirty && !window.confirm('Tải lại và bỏ các thay đổi chưa lưu?')) return
    await act('Tải lại', async () => {
      const ticket = ++request.current
      const chapters = await api.fetchChapters()
      const chapter = chapters.find((c) => c.chapterId === Number(id)) ?? chapters[0]
      if (!chapter) throw new Error('Chưa có chương được đăng ký.')
      const data = await readWorkspace(chapter, chapters)
      if (!alive.current || ticket !== request.current) return
      setWorkspace(data)
      setEdits(indexEdits(data.draft.overrides))
      setRestarted(false)
      setSelectedId(data.nodes.find((n) => n.fields.length)?.nodeId ?? null)
      invalidateReview()
    })
  }
  const savedBody = () => ({
    baseHash: workspace.chapter.baseHash,
    draftRevision: workspace.draft.draftRevision,
  })
  function acceptDraft(draft) {
    if (!alive.current) return
    setWorkspace((w) => ({ ...w, draft }))
    setEdits(indexEdits(draft.overrides))
    setRestarted(false)
    invalidateReview()
  }

  if (!workspace)
    return (
      <div className="story-editor">
        <h1>Nội dung kịch bản</h1>
        {error ? (
          <div role="alert" className="story-error">
            {error}
            <p>Hãy tải lại trang sau khi kết nối máy chủ.</p>
          </div>
        ) : (
          <p role="status">Đang mở bản thảo…</p>
        )}
      </div>
    )
  const { chapter, draft, versions } = workspace
  const canReview = !busy && !dirty && !restarted && !incompatible && draft.draftRevision > 0

  return (
    <div className="story-editor" aria-busy={Boolean(busy)}>
      <header className="story-heading">
        <div>
          <p className="story-kicker">K-ESTATE / BIÊN TẬP NỘI DUNG</p>
          <h1>Nội dung kịch bản</h1>
          <p>Sửa lời văn trên các phân đoạn có sẵn. Luồng điều tra được giữ nguyên.</p>
        </div>
        <label>
          Chương đang biên tập
          <select
            aria-label="Chương đang biên tập"
            disabled={Boolean(busy)}
            value={chapter.chapterId}
            onChange={(e) => reload(e.target.value)}
          >
            {workspace.chapters.map((c) => (
              <option key={c.chapterId} value={c.chapterId}>
                Chương {c.chapterId}
              </option>
            ))}
          </select>
        </label>
      </header>
      <div className="story-meta">
        <span>
          {chapter.nodeCount} phân đoạn · {chapter.editableFieldCount} trường được sửa
        </span>
        <span>
          Nháp {draft.draftRevision} · Đang dùng:{' '}
          {draft.publishedVersionId === null ? 'Bản gốc' : `#${draft.publishedVersionId}`}
        </span>
        <span role="status">
          {busy || (dirty || restarted ? 'Có thay đổi chưa lưu' : 'Bản nháp đã đồng bộ')}
        </span>
      </div>
      {error && (
        <div role="alert" className="story-error">
          {error}
          <button disabled={Boolean(busy)} onClick={() => reload()}>
            Tải lại từ máy chủ
          </button>
        </div>
      )}
      {notice && (
        <p role="status" className="story-success">
          {notice}
        </p>
      )}
      {incompatible && (
        <p role="alert" className="story-error">
          Dữ liệu chương đã thay đổi. Bản nháp cũ chỉ để đối chiếu; hãy bắt đầu lại từ chữ gốc và
          nhập lại sau khi rà soát.
        </p>
      )}
      <div className="story-workspace">
        <aside className="story-index" aria-label="Danh sách phân đoạn">
          <label className="story-search">
            Tìm phân đoạn
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Mã, loại, người nói hoặc nội dung…"
            />
          </label>
          <label>
            Loại phân đoạn
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">Tất cả loại</option>
              {[...new Set(nodes.map((n) => n.type))].sort().map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="story-check">
            <input
              type="checkbox"
              checked={editableOnly}
              onChange={(e) => setEditableOnly(e.target.checked)}
            />
            Chỉ hiện phân đoạn có chữ được sửa
          </label>
          <p className="story-count">{filtered.length} phân đoạn phù hợp</p>
          <div className="story-node-list">
            {!filtered.length && <p className="story-empty">Không tìm thấy phân đoạn phù hợp.</p>}
            {filtered.map((n) => (
              <button
                type="button"
                key={n.nodeId}
                aria-pressed={selectedId === n.nodeId}
                className="story-node"
                onClick={() => setSelectedId(n.nodeId)}
              >
                <span className="story-node-id">{n.nodeId}</span>
                <span>{n.speaker || n.type}</span>
                <span className="story-node-excerpt">
                  {readable(
                    n.fields[0]
                      ? (edits[storyTextKey({ nodeId: n.nodeId, ...n.fields[0] })]?.value ??
                          n.fields[0].baseText)
                      : 'Chỉ đọc — không có trường văn bản',
                  )}
                </span>
              </button>
            ))}
          </div>
        </aside>
        <section className="story-manuscript" aria-label="Biên tập phân đoạn">
          {selected ? (
            <>
              <header className="story-node-heading">
                <span className="story-node-id">{selected.nodeId}</span>
                <h2>{selected.speaker || 'Nội dung phân đoạn'}</h2>
                <span>
                  {selected.type} · {selected.fields.length} trường được sửa
                </span>
              </header>
              {selected.automaticallySkipped && (
                <p className="story-note">
                  Phân đoạn này được engine tự đi qua. Nội dung sửa được lưu nhưng không hiện thành
                  lời thoại trong game hiện tại.
                </p>
              )}
              {!selected.fields.length && (
                <p className="story-empty">
                  Phân đoạn chỉ đọc. Không có trường nằm trong phạm vi biên tập.
                </p>
              )}
              {selected.fields.map((field) => {
                const key = storyTextKey({ nodeId: selected.nodeId, ...field })
                const value = edits[key]?.value ?? field.baseText
                const publication = publishedEdits[key]?.value ?? field.baseText
                const count = [...value].length
                return (
                  <div key={key} className="story-field">
                    <p className="story-field-label">
                      {field.field === 'text' ? 'Nội dung' : `Lựa chọn ${field.choiceIndex + 1}`}
                    </p>
                    <details>
                      <summary>
                        Đối chiếu chữ gốc{publication !== field.baseText ? ' và bản đang dùng' : ''}
                      </summary>
                      <p className="story-reading">{readable(field.baseText)}</p>
                      {publication !== field.baseText && (
                        <>
                          <p className="story-field-label">Đang dùng</p>
                          <p className="story-reading">{readable(publication)}</p>
                        </>
                      )}
                    </details>
                    <label>
                      Nội dung bản nháp
                      <textarea
                        rows={field.field === 'text' ? 6 : 3}
                        disabled={Boolean(busy) || Boolean(incompatible)}
                        value={value}
                        aria-invalid={!value.trim() || count > field.limit}
                        onChange={(e) => updateText(selected, field, e.target.value)}
                      />
                    </label>
                    <div className="story-field-footer">
                      <span className={count > field.limit ? 'story-invalid' : ''}>
                        {count} / {field.limit} ký tự
                      </span>
                      <button
                        type="button"
                        disabled={
                          Boolean(busy) || Boolean(incompatible) || value === field.baseText
                        }
                        onClick={() => updateText(selected, field, field.baseText)}
                      >
                        Trả về chữ gốc
                      </button>
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <p className="story-empty">Chọn một phân đoạn để biên tập.</p>
          )}
        </section>
      </div>
      <div className="story-actions">
        <p>
          {currentOverrides.length} trường khác bản gốc ·{' '}
          {draft.updatedBy
            ? `Lưu bởi ${draft.updatedBy} lúc ${timeLabel(draft.updatedAt)}`
            : 'Chưa có bản nháp được lưu'}
        </p>
        <div>
          <button disabled={Boolean(busy)} onClick={() => reload()}>
            Tải lại
          </button>
          <button
            disabled={Boolean(busy)}
            onClick={() => {
              if (
                window.confirm(
                  'Đưa toàn bộ nội dung bản nháp về chữ gốc? Bản đang dùng chưa thay đổi.',
                )
              ) {
                setEdits({})
                setRestarted(true)
                invalidateReview()
              }
            }}
          >
            Về chữ gốc
          </button>
          <button
            className="story-primary"
            disabled={Boolean(busy) || Boolean(incompatible) || (!dirty && !restarted)}
            onClick={() =>
              act('Đang lưu', async () => {
                const saved = await api.saveDraft(chapter.chapterId, {
                  baseHash: chapter.baseHash,
                  expectedDraftRevision: draft.draftRevision,
                  overrides: currentOverrides,
                })
                acceptDraft(saved)
                setNotice('Đã lưu bản nháp. Nội dung đang dùng chưa thay đổi.')
              })
            }
          >
            Lưu bản nháp
          </button>
          <button
            disabled={!canReview}
            onClick={() =>
              act('Đang kiểm tra', async () => {
                const result = await api.validateDraft(chapter.chapterId, savedBody())
                setValidation(result)
                setPreview(null)
                setReviewed(false)
                setWorkspace((w) => ({
                  ...w,
                  draft: {
                    ...w.draft,
                    validationFingerprint: result.validationFingerprint,
                    previewFingerprint: null,
                  },
                }))
              })
            }
          >
            Kiểm tra
          </button>
          <button
            disabled={!canReview || !draft.validationFingerprint}
            onClick={() =>
              act('Đang mở xem trước', async () => {
                const result = await api.previewDraft(chapter.chapterId, savedBody())
                setPreview(result)
                setReviewed(false)
                setWorkspace((w) => ({
                  ...w,
                  draft: { ...w.draft, previewFingerprint: result.previewFingerprint },
                }))
              })
            }
          >
            Xem trước
          </button>
          <button
            className="story-publish"
            disabled={!canReview || !preview || !reviewed}
            onClick={() =>
              act('Đang xuất bản', async () => {
                const version = await api.publishDraft(chapter.chapterId, {
                  ...savedBody(),
                  expectedPublishedVersionId: draft.publishedVersionId,
                  validationFingerprint: draft.validationFingerprint,
                  previewFingerprint: draft.previewFingerprint,
                })
                setWorkspace((w) => ({
                  ...w,
                  published: version,
                  draft: { ...w.draft, publishedVersionId: version.versionId },
                  versions: [
                    version,
                    ...w.versions.filter((v) => v.versionId !== version.versionId),
                  ],
                }))
                setReviewed(false)
                setNotice(
                  `Đã xuất bản #${version.versionId}. Game lấy nội dung khi bắt đầu hoặc tiếp tục ván chơi.`,
                )
              })
            }
          >
            Xuất bản
          </button>
        </div>
      </div>
      {validation && (
        <section className="story-review" aria-label="Kết quả kiểm tra">
          <h2>{validation.valid ? 'Bản nháp hợp lệ' : 'Cần sửa bản nháp'}</h2>
          {validation.errors.map((item) => (
            <p key={item} className="story-invalid">
              {item}
            </p>
          ))}
          {validation.warnings.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </section>
      )}
      {preview && (
        <section className="story-review" aria-label="Xem trước bản nháp">
          <h2>Xem trước · nháp {preview.draftRevision}</h2>
          <p>
            Đối chiếu nội dung chữ. Phần này không chạy phân cảnh hoặc tác động đến tiến trình chơi.
          </p>
          {!preview.lines.length && <p>Bản này sẽ sử dụng toàn bộ chữ gốc.</p>}
          {preview.lines.map((line) => (
            <div className="story-preview-line" key={storyTextKey(line)}>
              <p className="story-node-id">
                {line.nodeId} · {line.speaker || line.type}
                {line.automaticallySkipped ? ' · engine tự đi qua' : ''}
              </p>
              <div className="story-diff">
                <div>
                  <span>Chữ gốc</span>
                  <p className="story-reading">{readable(line.baseText)}</p>
                </div>
                <div>
                  <span>Bản sẽ xuất bản</span>
                  <p className="story-reading">{readable(line.value)}</p>
                </div>
              </div>
            </div>
          ))}
          <label className="story-check">
            <input
              type="checkbox"
              disabled={Boolean(busy) || Boolean(dirty)}
              checked={reviewed}
              onChange={(e) => setReviewed(e.target.checked)}
            />
            Tôi đã rà soát nội dung và sự nhất quán với hồ sơ điều tra.
          </label>
        </section>
      )}
      <section className="story-review" aria-label="Lịch sử xuất bản">
        <h2>Lịch sử xuất bản</h2>
        {!versions.length ? (
          <p>Chưa có phiên bản xuất bản. Game đang dùng chữ gốc.</p>
        ) : (
          <div className="story-history-list">
            {versions.map((v) => (
              <div key={v.versionId} className="story-history-row">
                <span>
                  #{v.versionId}
                  {draft.publishedVersionId === v.versionId ? ' · Đang dùng' : ''}
                </span>
                <span>
                  {v.changedFieldCount} trường · {v.publishedBy} · {timeLabel(v.publishedAt)}
                </span>
                <button
                  disabled={Boolean(busy)}
                  onClick={() =>
                    act('Đang mở phiên bản', async () =>
                      setHistory(await api.fetchVersion(chapter.chapterId, v.versionId)),
                    )
                  }
                >
                  Xem thay đổi
                </button>
                <button
                  disabled={Boolean(busy) || v.baseHash !== chapter.baseHash}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Khôi phục #${v.versionId} vào bản nháp? Bản nháp hiện tại sẽ được thay thế; game chưa thay đổi.`,
                      )
                    ) {
                      act('Đang khôi phục bản nháp', async () => {
                        const restored = await api.restoreVersion(chapter.chapterId, v.versionId, {
                          baseHash: chapter.baseHash,
                          expectedDraftRevision: draft.draftRevision,
                        })
                        acceptDraft(restored)
                        setNotice(
                          'Đã khôi phục vào nháp. Hãy kiểm tra, xem trước và xuất bản để áp dụng.',
                        )
                      })
                    }
                  }}
                >
                  Khôi phục vào nháp
                </button>
              </div>
            ))}
          </div>
        )}
        {history && (
          <div className="story-history-detail">
            <h3>Phiên bản #{history.versionId}</h3>
            {!history.overrides.length && <p>Sử dụng toàn bộ chữ gốc.</p>}
            {history.overrides.map((entry) => {
              const node = nodes.find((n) => n.nodeId === entry.nodeId)
              const field = node?.fields.find(
                (f) =>
                  f.field === entry.field &&
                  (f.choiceIndex ?? null) === (entry.choiceIndex ?? null),
              )
              return (
                <div className="story-preview-line" key={storyTextKey(entry)}>
                  <p className="story-node-id">
                    {entry.nodeId}
                    {entry.choiceIndex === undefined ? '' : ` · lựa chọn ${entry.choiceIndex + 1}`}
                  </p>
                  <div className="story-diff">
                    <p className="story-reading">
                      {field ? readable(field.baseText) : 'Thuộc dữ liệu chương cũ'}
                    </p>
                    <p className="story-reading">{readable(entry.value)}</p>
                  </div>
                </div>
              )
            })}
            <button onClick={() => setHistory(null)}>Đóng đối chiếu</button>
          </div>
        )}
      </section>
    </div>
  )
}
