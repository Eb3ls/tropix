export const COLS = 14
export const ROWS = 10

export type TreeStatus = 'healthy' | 'monitoring' | 'alert' | 'empty'

export function getTreeStatus(idx: number): TreeStatus {
  const empty = new Set([0, 1, 12, 13, 126, 127, 138, 139])
  if (empty.has(idx)) return 'empty'
  if (idx === 62) return 'alert'
  if ([8, 23, 41, 78, 99, 115].includes(idx)) return 'monitoring'
  return 'healthy'
}

export const trees = Array.from({ length: COLS * ROWS }, (_, i) => ({
  id: i + 1,
  status: getTreeStatus(i),
}))

export const treeColor: Record<TreeStatus, string> = {
  healthy:    '#3A7A4E',
  monitoring: '#D9882B',
  alert:      '#B83A2E',
  empty:      'transparent',
}

export const activity = [
  { time: 'Today 07:23',       label: 'Alert generated',       detail: 'Tree 47 · Phytophthora signature',           critical: true  },
  { time: 'Today 06:47',       label: 'Drone flight complete',  detail: '8.3 ha · 127 trees surveyed',               critical: false },
  { time: 'Yesterday 14:00',   label: 'Sap-flow anomaly',       detail: 'Tree 47 · below baseline threshold',         critical: false },
  { time: '2 days ago 08:12',  label: 'Weather station',        detail: '24 °C · humidity 71 % · wind 12 km/h',      critical: false },
]

export const sapReadings = [
  { day: 'Mon', value: 82, baseline: 78 },
  { day: 'Tue', value: 79, baseline: 78 },
  { day: 'Wed', value: 74, baseline: 78 },
  { day: 'Thu', value: 68, baseline: 78 },
  { day: 'Fri', value: 61, baseline: 78 },
  { day: 'Sat', value: 54, baseline: 78 },
  { day: 'Sun', value: 47, baseline: 78 },
]
