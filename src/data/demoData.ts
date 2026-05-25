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
  healthy:    '#48C063',   // medium spring-green — visible but not neon on aerial foliage
  monitoring: '#CC5427',
  alert:      '#B83A2E',
}

export const PRIORITY_STYLE: Record<Priority, { bg: string; border: string; text: string; label: string; abbr: string }> = {
  urgent: { bg: 'rgba(184,58,46,0.07)',  border: 'rgba(184,58,46,0.28)',  text: '#B83A2E', label: 'URGENT', abbr: 'URG'  },
  high:   { bg: 'rgba(184,58,46,0.04)',  border: 'rgba(184,58,46,0.16)',  text: '#CC5427', label: 'HIGH',   abbr: 'HIGH' },
  medium: { bg: 'rgba(204,84,39,0.05)',  border: 'rgba(204,84,39,0.22)',  text: '#CC5427', label: 'MEDIUM', abbr: 'MED'  },
  low:    { bg: 'rgba(189,181,160,0.18)', border: 'rgba(189,181,160,0.45)', text: '#7A7060', label: 'LOW',   abbr: 'LOW'  },
}

// ─── Cultivar table ───────────────────────────────────────────────────────────
export const CULTIVARS: Record<Zone, string> = {
  Nord:   'Persea americana — Hass',
  Centro: 'Persea americana — Fuerte',
  Sud:    'Mangifera indica — Tommy Atkins',
}

// ─── Tree coordinates (percentage-based on aerial image 1024×650) ────────────
//
// Layout: quincunx (staggered rows) matching the aerial photo.
// Image is rendered with objectFit:fill so SVG % = image % directly.
//
// Column spacing: 7.7 % → 12 cols span ~88 %
//   even rows: col 0 at 4.0 % → col 11 at 88.7 %
//   odd rows:  col 0 at 0.0 % (stagger -4) → col 11 at 84.7 %
//
// Row positions (absolute % of image height) — calibrated against aerial photo:
//   Zone Nord   (rows 0–3,  idx 0–47):   8, 14, 23, 30 %
//   Zone Centro (rows 4–7,  idx 48–95):  38, 45, 54, 61 %
//   Zone Sud    (rows 8–11, idx 96–143): 68, 77, 84, 91 %
//
// Jitter: ±0.35 % (tight natural variation, does not displace from tree centre)
function generateTreeCoords(): Array<{ cx: number; cy: number }> {
  const coords: Array<{ cx: number; cy: number }> = []

  const COL_START   = 4      // first column of even rows (% of image width)
  const COL_STEP    = 7.7
  const COL_STAGGER = -4    // odd rows shift LEFT by 4 % (quincunx: right-stagger → left-stagger)

  const ZONE_ROWS = [
    { rowCy: [8, 14, 23, 30],  startIdx: 0,  absRowBase: 0, zoneXShift:  0 },
    { rowCy: [38, 45, 54, 61], startIdx: 48, absRowBase: 4, zoneXShift:  0 },
    { rowCy: [68, 77, 84, 91], startIdx: 96, absRowBase: 7, zoneXShift: -2 },
  ]

  for (const { rowCy, startIdx, absRowBase, zoneXShift } of ZONE_ROWS) {
    for (let row = 0; row < rowCy.length; row++) {
      const absRow  = absRowBase + row
      const xOffset = absRow % 2 === 1 ? COL_STAGGER : 0

      for (let col = 0; col < 12; col++) {
        const flatIdx = startIdx + row * 12 + col
        // Deterministic micro-jitter — different per tree, stays within ±0.35 %
        const jx = ((flatIdx * 7  + 3) % 7 - 3) * 0.117
        const jy = ((flatIdx * 11 + 5) % 7 - 3) * 0.117
        const rawCx = COL_START + xOffset + col * COL_STEP + jx
        // Left half (+2) corrects systematic left-drift in Nord/Centro zones.
        // zoneXShift corrects Sud zone which is ~2% right of actual tree centres.
        const cx = Math.round((rawCx + (rawCx <= 45 ? 2 : 0) + zoneXShift) * 10) / 10
        coords.push({
          cx,
          cy: Math.round((rowCy[row] + jy) * 10) / 10,
        })
      }
    }
  }

  return coords
}

export const TREE_COORDS = generateTreeCoords()

// Trees that don't exist in the physical orchard:
//   gridIndex 0   = A-01 (even row 0 col 0, cx≈6): bare earth, no tree at that spot
//   gridIndex 12  = A-13 (odd row 1 col 0, cx=0): left road boundary
//   gridIndex 36  = A-37 (odd row 3 col 0, cx=0): left road boundary
//   gridIndex 60  = B-13 (odd row 5 col 0, cx=0): left road boundary
//   gridIndex 84  = B-37 (odd row 7 col 0, cx=0): left road boundary
//   gridIndex 96  = C-01 (odd row 7 col 0, cx=0): left road boundary — Sud zone
//   gridIndex 108 = C-13 (even row 8 col 0, cx=4): bare earth
//   gridIndex 120 = C-25 (odd row 9 col 0, cx=0): left road boundary — Sud zone
//   gridIndex 132 = C-37 (even row 10 col 0, cx=4): bare earth
export const ABSENT_GRID_INDICES = new Set([0, 12, 36, 60, 84, 96, 108, 120, 132])

export function conditionCount(p: Partial<Pick<Plant, 'disease' | 'irrigation' | 'fertilizer'>>): number {
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
  // Sud plants — indices shifted +12 due to Centro gaining a row (boundary 84→96)
  103: {  // was 91 → C-08
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
  100: {  // was 88 → C-05
    status: 'monitoring',
    irrigation: {
      scheduledFor: 'tomorrow 08:30',
      duration: '40 min',
      reasoning: 'Forecast 34°C heat · sap-flow under stress from afternoon',
      sapFlowPct: 65,
    },
  },
  113: {  // was 101 → C-18
    status: 'monitoring',
    fertilizer: {
      nutrient: 'Iron (Fe)',
      dose: '2 g/L',
      product: 'Iron EDTA chelate 6%',
      scheduledFor: '27 May',
    },
  },
  127: {  // was 115 → C-32
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
  if (idx < 48)  return 'Nord'
  if (idx < 96)  return 'Centro'
  if (idx < 144) return 'Sud'
  // Extension trees appended after index 143 (1 per even row, up to 2 per odd row)
  // Nord:   144–147  Centro: 148–151  Sud: 152–157
  if (idx < 148) return 'Nord'
  if (idx < 152) return 'Centro'
  return 'Sud'
}

export function getZoneRelId(gridIndex: number): number {
  if (gridIndex < 48)  return gridIndex + 1
  if (gridIndex < 96)  return gridIndex - 48 + 1
  if (gridIndex < 144) return gridIndex - 96 + 1
  // Extension trees — continue numbering from 49 within their zone
  if (gridIndex < 148) return 49 + (gridIndex - 144)
  if (gridIndex < 152) return 49 + (gridIndex - 148)
  return 49 + (gridIndex - 152)
}

export function plantLabel(plant: Plant): string {
  const prefix = plant.zone === 'Nord' ? 'A' : plant.zone === 'Centro' ? 'B' : 'C'
  return `${prefix}-${String(getZoneRelId(plant.gridIndex)).padStart(2, '0')}`
}

function buildPlants(): Plant[] {
  // ── Base 144 trees ───────────────────────────────────────────────────────────
  const plants: Plant[] = Array.from({ length: 144 }, (_, i) => {
    const zone    = getZone(i)
    const sp      = SPECIAL[i]
    const status: PlantStatus = sp?.status ?? 'healthy'
    const base = {
      id: i + 1,
      gridIndex: i,
      zone,
      cultivar: CULTIVARS[zone],
      status,
      disease:    sp?.disease,
      irrigation: sp?.irrigation,
      fertilizer: sp?.fertilizer,
    }
    return {
      ...base,
      coords:         TREE_COORDS[i],
      conditionCount: conditionCount(base),
    }
  })

  // ── Extension trees: right-edge columns completing the quincunx ──────────────
  // Even rows +1 extra col (col 12); odd rows +2 extra cols (cols 12 & 13).
  // Col 13 of odd rows lands at rawCx≈100.1 → kept only for Sud (cx=98.1 after
  // zone shift); filtered for Nord/Centro (cx≥99, outside image).
  // Appended after index 143 so all SPECIAL gridIndex references stay valid.
  const EXT_ZONES: Array<{ rowCy: number[]; absRowBase: number; zoneXShift: number; zone: Zone }> = [
    { rowCy: [8, 14, 23, 30],  absRowBase: 0, zoneXShift:  0, zone: 'Nord'   },
    { rowCy: [38, 45, 54, 61], absRowBase: 4, zoneXShift:  0, zone: 'Centro' },
    { rowCy: [68, 77, 84, 91], absRowBase: 7, zoneXShift: -2, zone: 'Sud'    },
  ]
  const C0 = 4, CS = 7.7, CG = -4   // COL_START, COL_STEP, COL_STAGGER

  for (const { rowCy, absRowBase, zoneXShift, zone } of EXT_ZONES) {
    for (let row = 0; row < rowCy.length; row++) {
      const absRow    = absRowBase + row
      const isOdd     = absRow % 2 === 1
      const xOff      = isOdd ? CG : 0
      const extraCols = isOdd ? [12, 13] : [12]

      for (const col of extraCols) {
        const rawCx = C0 + xOff + col * CS
        const cx    = Math.round((rawCx + (rawCx <= 45 ? 2 : 0) + zoneXShift) * 10) / 10
        if (cx >= 99 || cx < 2) continue   // outside image bounds

        const gIdx = plants.length
        plants.push({
          id:             gIdx + 1,
          gridIndex:      gIdx,
          zone,
          cultivar:       CULTIVARS[zone],
          status:         'healthy',
          coords:         { cx, cy: rowCy[row] },
          conditionCount: 0,
        })
      }
    }
  }

  return plants
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
  { day: 'Tue 26',   tempC: 31, condition: 'partly-cloudy', note: '',                        highlight: false },
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
    title: 'Phytophthora monitoring',
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
    plantIds: [103],
  },
  {
    id: 'i5', priority: 'medium', type: 'irrigation',
    plantLabels: 'A-06, A-43, C-05', plantCount: 3,
    title: 'Scheduled irrigation',
    detail: 'Water stress detected · 25–40 min per tree · morning window',
    scheduledFor: 'tomorrow 08:00', done: false, overdue: false,
    plantIds: [5, 42, 100],
  },
  {
    id: 'i6', priority: 'medium', type: 'irrigation',
    plantLabels: 'B-05, C-32', plantCount: 2,
    title: 'Water stress irrigation',
    detail: 'Water stress detected in both trees · irrigate this evening',
    scheduledFor: 'today evening', done: false, overdue: false,
    plantIds: [52, 127],
  },
  {
    id: 'i7', priority: 'low', type: 'fertilizer',
    plantLabels: 'North zone · 11 trees', plantCount: 11,
    title: 'Nitrogen fertilisation',
    detail: 'Ammonium nitrate 27% · dose 8 g/m² · deficiency confirmed by NDVI',
    scheduledFor: '28 May', done: false, overdue: false,
    plantIds: [12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
  },
  {
    id: 'i8', priority: 'low', type: 'fertilizer',
    plantLabels: 'B-10, B-24, C-02, C-18', plantCount: 4,
    title: 'Calcium and phosphorus fertilisation',
    detail: 'Triple superphosphate + calcium nitrate · NDVI deficiency in central zone',
    scheduledFor: '29 May', done: false, overdue: false,
    plantIds: [57, 71, 97, 113],
  },
]
