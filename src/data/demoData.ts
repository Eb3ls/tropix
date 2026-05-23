// ─── Types ────────────────────────────────────────────────────────────────────
export type PlantStatus = 'healthy' | 'monitoring' | 'alert'
export type Zone = 'Nord' | 'Centro' | 'Sud'
export type Tab = 'all' | 'risk' | 'interventions'
export type Priority = 'urgent' | 'high' | 'medium' | 'low'
export type InterventionType = 'disease' | 'irrigation' | 'fertilizer'

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
}

// ─── Style constants ──────────────────────────────────────────────────────────
export const STATUS_COLOR: Record<PlantStatus, string> = {
  healthy:    '#3A7A4E',
  monitoring: '#D9882B',
  alert:      '#B83A2E',
}

export const PRIORITY_STYLE: Record<Priority, { bg: string; border: string; text: string; label: string }> = {
  urgent: { bg: 'rgba(184,58,46,0.07)',  border: 'rgba(184,58,46,0.28)', text: '#B83A2E', label: 'URGENTE' },
  high:   { bg: 'rgba(184,58,46,0.04)',  border: 'rgba(184,58,46,0.16)', text: '#A86415', label: 'ALTA'    },
  medium: { bg: 'rgba(217,136,43,0.05)', border: 'rgba(217,136,43,0.22)', text: '#A86415', label: 'MEDIA'   },
  low:    { bg: 'rgba(201,190,166,0.2)',  border: 'rgba(201,190,166,0.5)', text: '#524C42', label: 'BASSA'   },
}

// ─── Plant data ───────────────────────────────────────────────────────────────
export const CULTIVARS: Record<Zone, string> = {
  Nord:   'Persea americana — Hass',
  Centro: 'Persea americana — Fuerte',
  Sud:    'Mangifera indica — Tommy Atkins',
}

const SPECIAL: Record<number, Partial<Plant>> = {
  13: {
    status: 'alert',
    disease: {
      name: 'Phytophthora cinnamomi', probability: 91, detectedAt: '23 mag · 07:23',
      daysBeforeSymptoms: 14, action: 'Applicare fosetil-Al 3 g/L · ridurre irrigazione del 30% · isolare la zona radice',
    },
    irrigation: { scheduledFor: 'oggi 18:00', duration: '20 min', reasoning: 'Sap-flow al 41% della baseline — stress idrico confermato', sapFlowPct: 41 },
  },
  30: {
    status: 'alert',
    disease: {
      name: 'Phytophthora cinnamomi', probability: 78, detectedAt: '23 mag · 07:23',
      daysBeforeSymptoms: 14, action: 'Monitorare 48 h · considerare trattamento fosetil-Al preventivo',
    },
  },
  5: {
    status: 'monitoring',
    irrigation: { scheduledFor: 'domani 08:00', duration: '35 min', reasoning: 'Sap-flow in calo per 3 giorni consecutivi', sapFlowPct: 68 },
  },
  18: {
    status: 'monitoring',
    fertilizer: { nutrient: 'Azoto (N)', dose: '8 g/m²', product: 'Nitrato ammonico 27%', scheduledFor: '28 mag' },
  },
  42: {
    status: 'monitoring',
    irrigation: { scheduledFor: 'domani 07:30', duration: '30 min', reasoning: 'Temperatura alta prevista (34 °C) · sap-flow in tensione', sapFlowPct: 62 },
    fertilizer: { nutrient: 'Potassio (K)', dose: '6 g/m²', product: 'Solfato di potassio 50%', scheduledFor: '30 mag' },
  },
  57: {
    status: 'alert',
    disease: {
      name: 'Colletotrichum gloeosporioides', probability: 87, detectedAt: '22 mag · 14:11',
      daysBeforeSymptoms: 12, action: 'Trattamento rame ossicloruro 3 kg/hL · rimuovere frutti colpiti',
    },
    fertilizer: { nutrient: 'Calcio (Ca)', dose: '4 g/m²', product: 'Calcio nitrato 15%', scheduledFor: '27 mag' },
  },
  52: {
    status: 'monitoring',
    irrigation: { scheduledFor: 'oggi 20:00', duration: '25 min', reasoning: 'Umidità suolo scesa sotto soglia', sapFlowPct: 73 },
  },
  71: {
    status: 'monitoring',
    fertilizer: { nutrient: 'Fosforo (P)', dose: '5 g/m²', product: 'Superfosfato triplo 46%', scheduledFor: '29 mag' },
  },
  91: {
    status: 'alert',
    disease: {
      name: 'Phytophthora cinnamomi', probability: 72, detectedAt: '21 mag · 09:47',
      daysBeforeSymptoms: 11, action: 'Applicare fosetil-Al 3 g/L · migliorare drenaggio perimetrale',
    },
    irrigation: { scheduledFor: 'domani 07:00', duration: '15 min', reasoning: 'Irrigazione ridotta — stress confermato, non aggravare', sapFlowPct: 52 },
  },
  88: {
    status: 'monitoring',
    irrigation: { scheduledFor: 'domani 08:30', duration: '40 min', reasoning: 'Previsione caldo 34 °C · sap-flow in tensione dal pomeriggio', sapFlowPct: 65 },
  },
  101: {
    status: 'monitoring',
    fertilizer: { nutrient: 'Ferro (Fe)', dose: '2 g/L', product: 'Chelato di ferro EDTA 6%', scheduledFor: '27 mag' },
  },
  115: {
    status: 'monitoring',
    irrigation: { scheduledFor: 'oggi 19:00', duration: '30 min', reasoning: 'Sap-flow basso in zona sud per 3 giorni', sapFlowPct: 59 },
    fertilizer: { nutrient: 'Magnesio (Mg)', dose: '3 g/m²', product: 'Solfato di magnesio eptaidrato', scheduledFor: '31 mag' },
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
  return `${plant.zone.charAt(0)}-${String(getZoneRelId(plant.gridIndex)).padStart(2, '0')}`
}

function buildPlants(): Plant[] {
  return Array.from({ length: 120 }, (_, i) => {
    const zone = getZone(i)
    const sp = SPECIAL[i]
    return { id: i + 1, gridIndex: i, zone, cultivar: CULTIVARS[zone], status: sp?.status ?? 'healthy', ...sp } as Plant
  })
}

export const ALL_PLANTS = buildPlants()

// ─── Interventions ────────────────────────────────────────────────────────────
export const INITIAL_INTERVENTIONS: Intervention[] = [
  { id: 'i1', priority: 'urgent', type: 'disease', plantLabels: 'A-14', plantCount: 1,
    title: 'Trattamento Phytophthora cinnamomi',
    detail: 'Fosetil-Al 3 g/L · ridurre irrigazione del 30% · isolare zona radice',
    scheduledFor: 'oggi', done: false },
  { id: 'i2', priority: 'urgent', type: 'disease', plantLabels: 'B-10', plantCount: 1,
    title: 'Trattamento Colletotrichum gloeosporioides',
    detail: 'Rame ossicloruro 3 kg/hL · rimuovere frutti colpiti',
    scheduledFor: 'oggi', done: false },
  { id: 'i3', priority: 'high', type: 'disease', plantLabels: 'A-31', plantCount: 1,
    title: 'Monitoraggio Phytophthora — prob. 78%',
    detail: 'Monitorare 48 h · considerare trattamento preventivo se peggioramento',
    scheduledFor: 'entro 48 h', done: false },
  { id: 'i4', priority: 'high', type: 'disease', plantLabels: 'C-08', plantCount: 1,
    title: 'Trattamento Phytophthora cinnamomi',
    detail: 'Fosetil-Al 3 g/L · migliorare drenaggio perimetrale',
    scheduledFor: 'domani', done: false },
  { id: 'i5', priority: 'medium', type: 'irrigation', plantLabels: 'A-06, A-43, B-05, C-05, C-32', plantCount: 5,
    title: 'Irrigazione programmata',
    detail: 'Stress idrico rilevato · 25–40 min per pianta · fascia mattutina',
    scheduledFor: 'domani 08:00', done: false },
  { id: 'i6', priority: 'medium', type: 'irrigation', plantLabels: 'C-32', plantCount: 1,
    title: 'Irrigazione urgente',
    detail: 'Sap-flow 59% baseline · irrigare oggi in fascia serale',
    scheduledFor: 'oggi 19:00', done: false },
  { id: 'i7', priority: 'low', type: 'fertilizer', plantLabels: 'Zona Nord — 12 piante', plantCount: 12,
    title: 'Fertilizzazione azotata (N)',
    detail: 'Nitrato ammonico 27% · dose 8 g/m² · carenza confermata da NDVI',
    scheduledFor: '28 mag', done: false },
  { id: 'i8', priority: 'low', type: 'fertilizer', plantLabels: 'B-10, B-24, C-02, C-18', plantCount: 4,
    title: 'Fertilizzazione calcio e fosforo',
    detail: 'Superfosfato triplo + calcio nitrato · carenza NDVI zona centro',
    scheduledFor: '29 mag', done: false },
]
