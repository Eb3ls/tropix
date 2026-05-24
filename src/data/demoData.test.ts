// src/data/demoData.test.ts
// Pure-function tests for demoData — no DOM, no React.
import {
  getZone, getZoneRelId, plantLabel, conditionCount,
  ALL_PLANTS, TREE_COORDS, INITIAL_INTERVENTIONS, DEMO_WEATHER,
  type Plant,
} from './demoData'

// ── getZone ────────────────────────────────────────────────────────────────
describe('getZone', () => {
  test('index 0 → Nord',    () => expect(getZone(0)).toBe('Nord'))
  test('index 47 → Nord',   () => expect(getZone(47)).toBe('Nord'))
  test('index 48 → Centro', () => expect(getZone(48)).toBe('Centro'))
  test('index 83 → Centro', () => expect(getZone(83)).toBe('Centro'))
  test('index 84 → Sud',    () => expect(getZone(84)).toBe('Sud'))
  test('index 119 → Sud',   () => expect(getZone(119)).toBe('Sud'))
})

// ── getZoneRelId ───────────────────────────────────────────────────────────
describe('getZoneRelId', () => {
  test('0 → 1 (first Nord tree)',      () => expect(getZoneRelId(0)).toBe(1))
  test('47 → 48 (last Nord tree)',     () => expect(getZoneRelId(47)).toBe(48))
  test('48 → 1 (first Centro tree)',   () => expect(getZoneRelId(48)).toBe(1))
  test('83 → 36 (last Centro tree)',   () => expect(getZoneRelId(83)).toBe(36))
  test('84 → 1 (first Sud tree)',      () => expect(getZoneRelId(84)).toBe(1))
  test('119 → 36 (last Sud tree)',     () => expect(getZoneRelId(119)).toBe(36))
})

// ── plantLabel ─────────────────────────────────────────────────────────────
describe('plantLabel', () => {
  function plant(gridIndex: number): Plant {
    return ALL_PLANTS[gridIndex]
  }

  test('gridIndex 0 → A-01',   () => expect(plantLabel(plant(0))).toBe('A-01'))
  test('gridIndex 12 → A-13',  () => expect(plantLabel(plant(12))).toBe('A-13'))
  test('gridIndex 13 → A-14 (special alert tree)', () => expect(plantLabel(plant(13))).toBe('A-14'))
  test('gridIndex 47 → A-48',  () => expect(plantLabel(plant(47))).toBe('A-48'))
  test('gridIndex 48 → B-01',  () => expect(plantLabel(plant(48))).toBe('B-01'))
  test('gridIndex 57 → B-10',  () => expect(plantLabel(plant(57))).toBe('B-10'))
  test('gridIndex 83 → B-36',  () => expect(plantLabel(plant(83))).toBe('B-36'))
  test('gridIndex 84 → C-01',  () => expect(plantLabel(plant(84))).toBe('C-01'))
  test('gridIndex 119 → C-36', () => expect(plantLabel(plant(119))).toBe('C-36'))
})

// ── conditionCount ─────────────────────────────────────────────────────────
describe('conditionCount', () => {
  const d = { name: 'X', probability: 50, detectedAt: '', daysBeforeSymptoms: 7, action: '' }
  const i = { scheduledFor: '', duration: '', reasoning: '', sapFlowPct: 70 }
  const f = { nutrient: 'N', dose: '5g', product: 'Urea', scheduledFor: '' }

  test('no conditions → 0',           () => expect(conditionCount({})).toBe(0))
  test('disease only → 1',            () => expect(conditionCount({ disease: d })).toBe(1))
  test('irrigation only → 1',         () => expect(conditionCount({ irrigation: i })).toBe(1))
  test('fertilizer only → 1',         () => expect(conditionCount({ fertilizer: f })).toBe(1))
  test('disease + irrigation → 2',    () => expect(conditionCount({ disease: d, irrigation: i })).toBe(2))
  test('all three → 3',               () => expect(conditionCount({ disease: d, irrigation: i, fertilizer: f })).toBe(3))
})

// ── ALL_PLANTS ─────────────────────────────────────────────────────────────
describe('ALL_PLANTS', () => {
  test('has exactly 120 plants', () => expect(ALL_PLANTS).toHaveLength(120))

  test('gridIndex matches array index for every plant', () => {
    ALL_PLANTS.forEach((p, i) => expect(p.gridIndex).toBe(i))
  })

  test('every gridIndex is unique', () => {
    const ids = ALL_PLANTS.map(p => p.gridIndex)
    expect(new Set(ids).size).toBe(120)
  })

  test('every plant has a valid zone', () => {
    ALL_PLANTS.forEach(p => {
      expect(['Nord', 'Centro', 'Sud']).toContain(p.zone)
    })
  })

  test('every plant has a valid status', () => {
    ALL_PLANTS.forEach(p => {
      expect(['healthy', 'monitoring', 'alert']).toContain(p.status)
    })
  })

  test('plant 13 (A-14) is alert with Phytophthora', () => {
    const p = ALL_PLANTS[13]
    expect(p.status).toBe('alert')
    expect(p.disease?.name).toBe('Phytophthora cinnamomi')
    expect(p.disease?.probability).toBe(91)
  })

  test('plant 57 (B-10) is alert with Colletotrichum', () => {
    const p = ALL_PLANTS[57]
    expect(p.status).toBe('alert')
    expect(p.disease?.name).toBe('Colletotrichum gloeosporioides')
  })

  test('plant 42 has 2 conditions (irrigation + fertilizer)', () => {
    const p = ALL_PLANTS[42]
    expect(p.conditionCount).toBe(2)
  })

  test('plant 115 has 2 conditions', () => {
    const p = ALL_PLANTS[115]
    expect(p.conditionCount).toBe(2)
  })

  test('healthy plants have conditionCount 0', () => {
    const healthy = ALL_PLANTS.filter(p => p.status === 'healthy')
    healthy.forEach(p => expect(p.conditionCount).toBe(0))
  })
})

// ── TREE_COORDS ────────────────────────────────────────────────────────────
describe('TREE_COORDS', () => {
  test('has exactly 120 entries', () => expect(TREE_COORDS).toHaveLength(120))

  test('every coord is in 0–100 range', () => {
    TREE_COORDS.forEach(({ cx, cy }) => {
      expect(cx).toBeGreaterThanOrEqual(0)
      expect(cx).toBeLessThanOrEqual(100)
      expect(cy).toBeGreaterThanOrEqual(0)
      expect(cy).toBeLessThanOrEqual(100)
    })
  })
})

// ── INITIAL_INTERVENTIONS ──────────────────────────────────────────────────
describe('INITIAL_INTERVENTIONS', () => {
  test('all plantIds are valid gridIndex values (0–119)', () => {
    INITIAL_INTERVENTIONS.forEach(i => {
      i.plantIds.forEach(id => {
        expect(id).toBeGreaterThanOrEqual(0)
        expect(id).toBeLessThanOrEqual(119)
      })
    })
  })

  test('intervention i1 covers gridIndex 13 (A-14)', () => {
    const i1 = INITIAL_INTERVENTIONS.find(i => i.id === 'i1')!
    expect(i1.plantIds).toContain(13)
  })

  test('intervention i2 covers gridIndex 57 (B-10)', () => {
    const i2 = INITIAL_INTERVENTIONS.find(i => i.id === 'i2')!
    expect(i2.plantIds).toContain(57)
  })

  test('i1 is overdue', () => {
    const i1 = INITIAL_INTERVENTIONS.find(i => i.id === 'i1')!
    expect(i1.overdue).toBe(true)
  })

  test('all interventions start as not done', () => {
    INITIAL_INTERVENTIONS.forEach(i => expect(i.done).toBe(false))
  })

  test('urgent interventions have disease type', () => {
    const urgent = INITIAL_INTERVENTIONS.filter(i => i.priority === 'urgent')
    urgent.forEach(i => expect(i.type).toBe('disease'))
  })
})

// ── DEMO_WEATHER ───────────────────────────────────────────────────────────
describe('DEMO_WEATHER', () => {
  test('has exactly 3 days', () => expect(DEMO_WEATHER).toHaveLength(3))

  test('Tomorrow is the highlighted heat day', () => {
    const tomorrow = DEMO_WEATHER.find(d => d.day === 'Tomorrow')
    expect(tomorrow).toBeDefined()
    expect(tomorrow!.highlight).toBe(true)
    expect(tomorrow!.tempC).toBeGreaterThanOrEqual(34)
  })

  test('Today is not highlighted', () => {
    const today = DEMO_WEATHER.find(d => d.day === 'Today')
    expect(today?.highlight).toBe(false)
  })
})
