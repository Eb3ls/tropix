// ─── Types ────────────────────────────────────────────────────────────────────
export type PlantStatus     = 'healthy' | 'monitoring' | 'alert'
export type Zone            = 'Nord' | 'Centro' | 'Sud'
export type Tab             = 'all' | 'risk' | 'interventions'
export type Priority        = 'urgent' | 'high' | 'medium' | 'low'
export type InterventionType = 'disease' | 'irrigation' | 'fertilizer'
export type AlertState = 'active' | 'treated' | 'resolved'

export interface DiseaseRec {
  name: string
  probability: number
  detectedAt: string
  daysBeforeSymptoms: number
  action: string
}
export interface IrrigationRec {
  scheduledFor: string
  duration: string
  reasoning: string
  sapFlowPct: number
}
export interface FertilizerRec {
  nutrient: string
  dose: string
  product: string
  scheduledFor: string
}
export interface Plant {
  id: number
  gridIndex: number
  zone: Zone
  cultivar: string
  status: PlantStatus
  disease?: DiseaseRec
  irrigation?: IrrigationRec
  fertilizer?: FertilizerRec
  coords: { cx: number; cy: number }
  conditionCount: number
}
export interface Intervention {
  id: string
  priority: Priority
  type: InterventionType
  plantLabels: string
  plantCount: number
  title: string
  detail: string
  scheduledFor: string
  done: boolean
  overdue: boolean
  plantIds: number[]
}

// ─── Zone display labels ──────────────────────────────────────────────────────
export const ZONE_LABEL: Record<Zone, string> = {
  Nord:   'North',
  Centro: 'Central',
  Sud:    'South',
}

// ─── Style constants ──────────────────────────────────────────────────────────
export const STATUS_COLOR: Record<PlantStatus, string> = {
  healthy:    '#3A7A4E',
  monitoring: '#CC5427',
  alert:      '#B83A2E',
}

export const PRIORITY_STYLE: Record<Priority, { bg: string; border: string; text: string; label: string }> = {
  urgent: { bg: 'rgba(184,58,46,0.07)',  border: 'rgba(184,58,46,0.28)',  text: '#B83A2E', label: 'URGENT' },
  high:   { bg: 'rgba(184,58,46,0.04)',  border: 'rgba(184,58,46,0.16)',  text: '#CC5427', label: 'HIGH'   },
  medium: { bg: 'rgba(204,84,39,0.05)',  border: 'rgba(204,84,39,0.22)',  text: '#CC5427', label: 'MEDIUM' },
  low:    { bg: 'rgba(189,181,160,0.18)', border: 'rgba(189,181,160,0.45)', text: '#7A7060', label: 'LOW'  },
}

// ─── Cultivar table ───────────────────────────────────────────────────────────
export const CULTIVARS: Record<Zone, string> = {
  Nord:   'Persea americana — Hass',
  Centro: 'Persea americana — Fuerte',
  Sud:    'Mangifera indica — Tommy Atkins',
}

// ─── Tree coordinates (percentage-based on aerial image) ─────────────────────
function generateTreeCoords(): Array<{ cx: number; cy: number }> {
  const coords: Array<{ cx: number; cy: number }> = []
  const colX = (col: number) => 4.2 + col * 8.33

  // Zone North: indices 0–47, 4 rows × 12 cols, cy 6%–36%
  for (let i = 0; i < 48; i++) {
    const row = Math.floor(i / 12)
    const col = i % 12
    const jx = ((i * 7 + 3) % 17 - 8) * 0.18
    const jy = ((i * 11 + 5) % 13 - 6) * 0.22
    coords.push({
      cx: Math.round((colX(col) + jx) * 10) / 10,
      cy: Math.round((6 + row * 10 + jy) * 10) / 10,
    })
  }

  // Zone Central: indices 48–83, 3 rows × 12 cols, cy 46%–62%
  for (let i = 0; i < 36; i++) {
    const idx = 48 + i
    const row = Math.floor(i / 12)
    const col = i % 12
    const jx = ((idx * 7 + 3) % 17 - 8) * 0.18
    const jy = ((idx * 11 + 5) % 13 - 6) * 0.22
    coords.push({
      cx: Math.round((colX(col) + jx) * 10) / 10,
      cy: Math.round((46 + row * 8 + jy) * 10) / 10,
    })
  }

  // Zone South: indices 84–119, 3 rows × 12 cols, cy 72%–88%
  for (let i = 0; i < 36; i++) {
    const idx = 84 + i
    const row = Math.floor(i / 12)
    const col = i % 12
    const jx = ((idx * 7 + 3) % 17 - 8) * 0.18
    const jy = ((idx * 11 + 5) % 13 - 6) * 0.22
    coords.push({
      cx: Math.round((colX(col) + jx) * 10) / 10,
      cy: Math.round((72 + row * 8 + jy) * 10) / 10,
    })
  }

  return coords
}

export const TREE_COORDS = generateTreeCoords()

export function conditionCount(p: { disease?: unknown; irrigation?: unknown; fertilizer?: unknown }): number {
  return (p.disease ? 1 : 0) + (p.irrigation ? 1 : 0) + (p.fertilizer ? 1 : 0)
}

// ─── Per-plant special data ───────────────────────────────────────────────────
const SPECIAL: Record<number, Partial<Plant>> = {
  13: {
    status: 'alert',
    disease: {
      name: 'Phytophthora cinnamomi',
      probability: 91,
      detectedAt: '23 May · 07:23',
      daysBeforeSymptoms: 14,
      action: 'Apply Fosetil-Al 3 g/L · reduce irrigation 30% · isolate root zone',
    },
    irrigation: {
      scheduledFor: 'today 18:00',
      duration: '20 min',
      reasoning: 'Sap-flow at 41% of baseline — water stress confirmed',
      sapFlowPct: 41,
    },
  },
  30: {
    status: 'alert',
    disease: {
      name: 'Phytophthora cinnamomi',
      probability: 78,
      detectedAt: '23 May · 07:23',
      daysBeforeSymptoms: 14,
      action: 'Monitor 48h · consider preventive Fosetil-Al treatment if worsening',
    },
  },
  5: {
    status: 'monitoring',
    irrigation: {
      scheduledFor: 'tomorrow 08:00',
      duration: '35 min',
      reasoning: 'Sap-flow declining for 3 consecutive days',
      sapFlowPct: 68,
    },
  },
  18: {
    status: 'monitoring',
    fertilizer: {
      nutrient: 'Nitrogen (N)',
      dose: '8 g/m²',
      product: 'Ammonium nitrate 27%',
      scheduledFor: '28 May',
    },
  },
  42: {
    status: 'monitoring',
    irrigation: {
      scheduledFor: 'tomorrow 07:30',
      duration: '30 min',
      reasoning: 'High temperature forecast (34°C) · sap-flow under stress',
      sapFlowPct: 62,
    },
    fertilizer: {
      nutrient: 'Potassium (K)',
      dose: '6 g/m²',
      product: 'Potassium sulphate 50%',
      scheduledFor: '30 May',
    },
  },
  57: {
    status: 'alert',
    disease: {
      name: 'Colletotrichum gloeosporioides',
      probability: 87,
      detectedAt: '22 May · 14:11',
      daysBeforeSymptoms: 12,
      action: 'Treat with copper oxychloride 3 kg/hL · remove affected fruit',
    },
    fertilizer: {
      nutrient: 'Calcium (Ca)',
      dose: '4 g/m²',
      product: 'Calcium nitrate 15%',
      scheduledFor: '27 May',
    },
  },
  52: {
    status: 'monitoring',
    irrigation: {
      scheduledFor: 'today 20:00',
      duration: '25 min',
      reasoning: 'Soil moisture below threshold',
      sapFlowPct: 73,
    },
  },
  71: {
    status: 'monitoring',
    fertilizer: {
      nutrient: 'Phosphorus (P)',
      dose: '5 g/m²',
      product: 'Triple superphosphate 46%',
      scheduledFor: '29 May',
    },
  },
  91: {
    status: 'alert',
    disease: {
      name: 'Phytophthora cinnamomi',
      probability: 72,
      detectedAt: '21 May · 09:47',
      daysBeforeSymptoms: 11,
      action: 'Apply Fosetil-Al 3 g/L · improve perimeter drainage',
    },
    irrigation: {
      scheduledFor: 'tomorrow 07:00',
      duration: '15 min',
      reasoning: 'Irrigation reduced — stress confirmed, do not aggravate',
      sapFlowPct: 52,
    },
  },
  88: {
    status: 'monitoring',
    irrigation: {
      scheduledFor: 'tomorrow 08:30',
      duration: '40 min',
      reasoning: 'Forecast 34°C heat · sap-flow under stress from afternoon',
      sapFlowPct: 65,
    },
  },
  101: {
    status: 'monitoring',
    fertilizer: {
      nutrient: 'Iron (Fe)',
      dose: '2 g/L',
      product: 'Iron EDTA chelate 6%',
      scheduledFor: '27 May',
    },
  },
  115: {
    status: 'monitoring',
    irrigation: {
      scheduledFor: 'today 19:00',
      duration: '30 min',
      reasoning: 'Sap-flow low in southern zone for 3 days',
      sapFlowPct: 59,
    },
    fertilizer: {
      nutrient: 'Magnesium (Mg)',
      dose: '3 g/m²',
      product: 'Magnesium sulphate heptahydrate',
      scheduledFor: '31 May',
    },
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getZone(idx: number): Zone {
  if (idx < 48) return 'Nord'
  if (idx < 84) return 'Centro'
  return 'Sud'
}

export function getZoneRelId(gridIndex: number): number {
  if (gridIndex < 48) return gridIndex + 1
  if (gridIndex < 84) return gridIndex - 48 + 1
  return gridIndex - 84 + 1
}

export function plantLabel(plant: Plant): string {
  const prefix = plant.zone === 'Nord' ? 'A' : plant.zone === 'Centro' ? 'B' : 'C'
  return `${prefix}-${String(getZoneRelId(plant.gridIndex)).padStart(2, '0')}`
}

function buildPlants(): Plant[] {
  return Array.from({ length: 120 }, (_, i) => {
    const zone = getZone(i)
    const sp   = SPECIAL[i]
    const base = {
      id: i + 1, gridIndex: i, zone,
      cultivar: CULTIVARS[zone],
      status: sp?.status ?? 'healthy' as PlantStatus,
      ...sp,
    }
    return {
      ...base,
      coords: TREE_COORDS[i],
      conditionCount: conditionCount(base),
    } as Plant
  })
}

export const ALL_PLANTS = buildPlants()

// ─── Weather (static demo data) ──────────────────────────────────────────────
export interface WeatherDay {
  day: string
  tempC: number
  condition: 'sunny' | 'partly-cloudy' | 'cloudy'
  note: string
  highlight: boolean
}

export const DEMO_WEATHER: WeatherDay[] = [
  { day: 'Today',    tempC: 28, condition: 'partly-cloudy', note: '',                        highlight: false },
  { day: 'Tomorrow', tempC: 34, condition: 'sunny',         note: 'Heat · irrigate morning', highlight: true  },
  { day: 'Sun 26',   tempC: 31, condition: 'partly-cloudy', note: '',                        highlight: false },
]

// ─── Interventions ────────────────────────────────────────────────────────────
export const INITIAL_INTERVENTIONS: Intervention[] = [
  {
    id: 'i1', priority: 'urgent', type: 'disease',
    plantLabels: 'A-14', plantCount: 1,
    title: 'Phytophthora cinnamomi treatment',
    detail: 'Fosetil-Al 3 g/L · reduce irrigation 30% · isolate root zone',
    scheduledFor: 'today', done: false, overdue: true,
    plantIds: [13],
  },
  {
    id: 'i2', priority: 'urgent', type: 'disease',
    plantLabels: 'B-10', plantCount: 1,
    title: 'Colletotrichum gloeosporioides treatment',
    detail: 'Copper oxychloride 3 kg/hL · remove affected fruit',
    scheduledFor: 'today', done: false, overdue: false,
    plantIds: [57],
  },
  {
    id: 'i3', priority: 'high', type: 'disease',
    plantLabels: 'A-31', plantCount: 1,
    title: 'Phytophthora monitoring — prob. 78%',
    detail: 'Monitor 48h · consider preventive treatment if worsening',
    scheduledFor: 'within 48h', done: false, overdue: false,
    plantIds: [30],
  },
  {
    id: 'i4', priority: 'high', type: 'disease',
    plantLabels: 'C-08', plantCount: 1,
    title: 'Phytophthora cinnamomi treatment',
    detail: 'Fosetil-Al 3 g/L · improve perimeter drainage',
    scheduledFor: 'tomorrow', done: false, overdue: false,
    plantIds: [91],
  },
  {
    id: 'i5', priority: 'medium', type: 'irrigation',
    plantLabels: 'A-06, A-43, B-05, C-05, C-32', plantCount: 5,
    title: 'Scheduled irrigation',
    detail: 'Water stress detected · 25–40 min per tree · morning window',
    scheduledFor: 'tomorrow 08:00', done: false, overdue: false,
    plantIds: [5, 42, 52, 88, 115],
  },
  {
    id: 'i6', priority: 'medium', type: 'irrigation',
    plantLabels: 'C-32', plantCount: 1,
    title: 'Urgent irrigation',
    detail: 'Sap-flow at 59% of baseline · irrigate this evening',
    scheduledFor: 'today 19:00', done: false, overdue: false,
    plantIds: [115],
  },
  {
    id: 'i7', priority: 'low', type: 'fertilizer',
    plantLabels: 'Zone North — 12 trees', plantCount: 12,
    title: 'Nitrogen fertilisation (N)',
    detail: 'Ammonium nitrate 27% · dose 8 g/m² · deficiency confirmed by NDVI',
    scheduledFor: '28 May', done: false, overdue: false,
    plantIds: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
  },
  {
    id: 'i8', priority: 'low', type: 'fertilizer',
    plantLabels: 'B-10, B-24, C-02, C-18', plantCount: 4,
    title: 'Calcium and phosphorus fertilisation',
    detail: 'Triple superphosphate + calcium nitrate · NDVI deficiency in central zone',
    scheduledFor: '29 May', done: false, overdue: false,
    plantIds: [57, 71, 85, 101],
  },
]
