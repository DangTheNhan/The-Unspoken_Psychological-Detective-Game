import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { createTranslator } from './i18n'
import {
  timelineGroups,
  timelineSources,
  timelineSourceSummary,
  timelineStatus,
  timelineTitle,
} from './timeline'

const t = createTranslator('vi')

describe('timeline — thứ tự sự kiện và nguồn đã thu', () => {
  it('sắp giờ sự kiện, giữ khoảng ước lượng và không sửa thứ tự state đã lưu', () => {
    const entries = [
      { id: 'opening', display_time: '21:35', precision: 'clock' },
      { id: 'hoa', display_time: 'khoảng 21:30', precision: 'estimated' },
      { id: 'receipt', display_time: '20:55 ghi trên giấy', precision: 'inscribed' },
      { id: 'minh', display_time: 'tới khoảng 20:45; rời trước 21:00', precision: 'estimated' },
      { id: 'linh', display_time: 'khoảng 20:00 hoặc hơn', precision: 'estimated' },
    ]
    const before = JSON.stringify(entries)
    const { timed } = timelineGroups(entries)
    expect(timed.map(({ id }) => id)).toEqual(['linh', 'minh', 'receipt', 'hoa', 'opening'])
    expect(timed[0].display_time).toBe('khoảng 20:00 hoặc hơn')
    expect(JSON.stringify(entries)).toBe(before)
  })

  it('giữ quan hệ trước/sau và bản lưu thiếu giờ ngoài nhóm mốc có giờ', () => {
    const relation = { id: 'relation', display_time: 'Sau lượt 21:20', precision: 'relation' }
    const old = { id: 'old', title: 'Ghi chú cũ' }
    const invalid = { id: 'invalid', display_time: '25:80' }
    const clock = { id: 'clock', display_time: '21:35' }
    expect(timelineGroups([relation, old, invalid, clock])).toEqual({
      timed: [clock],
      relation: [relation],
      unknown: [old, invalid],
    })
  })

  it('chỉ mở nguồn thực có trong state và giữ thứ tự nguồn của bản ghi', () => {
    const statement = { id: 'ST_HOA', speaker: 'HOA', text: 'Nội dung lời khai' }
    const receipt = { id: 'EV_RECEIPT', name: 'Biên nhận tiền trọ' }
    const entry = { source_ids: ['ST_HOA', 'ST_NOT_COLLECTED', 'EV_RECEIPT'] }
    const state = { statements: { ST_HOA: statement }, evidence_records: { EV_RECEIPT: receipt } }
    expect(timelineSources(entry, state)).toEqual([statement, receipt])
    expect(timelineSourceSummary(entry, state, t)).toBe('2 nguồn đối chiếu')
    expect(timelineSourceSummary({ source_ids: ['ST_HOA'] }, state, t)).toBe('Lời khai của Hòa')
    expect(timelineSources(entry, null)).toEqual([])
    expect(timelineSourceSummary(entry, null, t)).toBe('Chưa có bản ghi nguồn')
  })

  it('giữ phân biệt lời tự khai, giờ trên giấy, đối chứng và trạng thái bản lưu cũ', () => {
    expect(timelineStatus({ status: 'claimed' }, t)).toContain('Chưa đối chứng')
    expect(timelineStatus({ status: 'needs_corrob' }, t)).toContain('Cần đối chứng')
    expect(timelineStatus({ status: 'corroborated_visit' }, t)).toBe('Đã đối chứng lượt xuất hiện')
    expect(timelineStatus({ status: 'legacy_status' }, t)).toBe('Chưa xác định mức độ kiểm chứng')
    expect(
      timelineStatus({ status: 'claimed', source_ids: ['ST_OLD'] }, t, {
        statements: { ST_OLD: { status: 'superseded' } },
      }),
    ).toBe('Đã có thông tin thay thế')
  })

  it('mọi mốc Chương 1 có tiêu đề sự kiện và trạng thái dễ đọc bằng cả hai ngôn ngữ', () => {
    const graph = JSON.parse(
      readFileSync(
        new URL('../../../public/assets/chapters/chapter1/chapter1.json', import.meta.url),
      ),
    )
    const entries = graph.nodes.flatMap((node) =>
      (node.effects ?? [])
        .filter((effect) => effect.path?.startsWith('/timeline/'))
        .map((effect) => effect.after.literal),
    )
    for (const language of ['vi', 'en']) {
      const translate = createTranslator(language)
      for (const entry of entries) {
        expect(timelineTitle(entry, translate)).not.toMatch(/notebook\.|TL_/)
        expect(timelineStatus(entry, translate)).not.toMatch(/notebook\.|_/)
      }
    }
    expect(timelineTitle({ id: 'old', title: 'Ghi chú cũ' }, t)).toBe('Ghi chú cũ')
  })
})
