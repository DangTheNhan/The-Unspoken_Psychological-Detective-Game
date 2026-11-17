import { storyTextKey } from '@/game/narrative/storyText'

const labels = {
  action: 'Hành động',
  checklist: 'Danh sách kiểm tra',
  checkpoint_restore: 'Khôi phục điểm lưu',
  choice: 'Lựa chọn',
  cross_examination: 'Thẩm vấn',
  deduction: 'Suy luận',
  dialogue: 'Hội thoại',
  investigation: 'Điều tra',
  narration: 'Lời dẫn',
  notebook_update: 'Cập nhật Sổ tay',
  notebook_view: 'Xem Sổ tay',
  record_view: 'Xem hồ sơ',
  router: 'Điều hướng',
  source_view: 'Xem nguồn',
  transition: 'Chuyển cảnh',
  ui: 'Giao diện',
}

export const storyTypeLabel = (type) => labels[type] ?? type
const inScope = (node, editableOnly) => !editableOnly || node.fields.length > 0

/** Use the server's permitted fields; UI labels never expand the editing allowlist. */
export function storyNodeTypes(nodes = [], editableOnly = true) {
  return [
    ...new Set(nodes.filter((node) => inScope(node, editableOnly)).map((node) => node.type)),
  ].sort((a, b) => storyTypeLabel(a).localeCompare(storyTypeLabel(b), 'vi'))
}

export function filterStoryNodes(nodes = [], { editableOnly, type, query, edits }) {
  const q = query.trim().toLowerCase()
  return nodes.filter((node) => {
    if (!inScope(node, editableOnly) || (type && node.type !== type)) return false
    const text = node.fields
      .map(
        (field) =>
          `${field.baseText} ${edits[storyTextKey({ nodeId: node.nodeId, ...field })]?.value ?? ''}`,
      )
      .join(' ')
    return (
      !q ||
      `${node.nodeId} ${node.type} ${storyTypeLabel(node.type)} ${node.speaker} ${text}`
        .toLowerCase()
        .includes(q)
    )
  })
}
