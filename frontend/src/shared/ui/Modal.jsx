import { useEffect, useId, useRef } from 'react'

export function Modal({ title, children, onClose, initialFocusRef }) {
  const dialog = useRef(null)
  const titleId = useId()
  useEffect(() => {
    const element = dialog.current
    element.showModal()
    initialFocusRef?.current?.focus()
    return () => element.close()
  }, [initialFocusRef])
  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return
        event.stopPropagation()
        if (event.repeat) event.preventDefault()
      }}
      onCancel={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }}
      className="m-auto max-h-[90dvh] w-[min(94vw,560px)] overflow-auto rounded border border-[#5c5266] bg-[#241f2b] p-6 text-[#f4efe6] shadow-xl backdrop:bg-black/75"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>
        <button
          type="button"
          aria-label="Đóng hộp thoại"
          onClick={onClose}
          className="rounded border border-stone-600 px-2 text-stone-300 hover:text-white"
        >
          ×
        </button>
      </div>
      {children}
    </dialog>
  )
}
