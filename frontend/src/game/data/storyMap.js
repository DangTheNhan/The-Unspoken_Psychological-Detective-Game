import { ROOM_204_HOTSPOTS } from './rooms/room204'

const HALLWAY_TARGETS = {
  P1_LINH_DISPATCH: { name: 'Linh', stand: [784, 458] },
  P1_HAO_DISPATCH: { name: 'Hào', stand: [518, 464] },
  P1_MINH_DISPATCH: { name: 'Minh', stand: [929, 458] },
  P1_REVISIT_HOA: { name: 'Hòa', stand: [632, 458] },
  P3_LINH_START: { name: 'Linh', stand: [784, 458] },
  P3_HAO_START: { name: 'Hào', stand: [518, 464] },
  P3_MINH_START: { name: 'Minh', stand: [929, 458] },
  P3_HOA_START: { name: 'Hòa', stand: [632, 458] },
}

export function isStoryMapNode(node) {
  return ['P1_HUB_MENU', 'P3_HUB', 'P2_ROOM_UI'].includes(node?.id)
}

export function storyMapHotspots(runner) {
  if (!isStoryMapNode(runner.node)) return []
  return runner.choices().flatMap((choice) => {
    const target =
      runner.node.type === 'investigation'
        ? ROOM_204_HOTSPOTS[choice.id ?? choice.targetNode]
        : HALLWAY_TARGETS[choice.targetNode]
    if (!target) return []
    const [x, y] = target.stand
    return [
      {
        id: choice.id ?? choice.targetNode,
        label: choice.text,
        face: 'up',
        choiceIndex: choice.index,
        ...target,
        name:
          choice.targetNode === 'P1_HAO_DISPATCH' && !runner.state.flags.hao_name_known
            ? 'Người đàn ông'
            : target.name,
        rect: target.rect ?? [x - 29, y - 70, 58, 68],
      },
    ]
  })
}
