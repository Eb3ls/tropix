// src/components/demo/DemoCards.test.tsx
import { render, screen } from '@testing-library/react'
import { DiseaseCard, IrrigationCard, FertilizerCard } from './DemoCards'
import type { DiseaseRec, IrrigationRec, FertilizerRec } from '../../data/demoData'

// ── Test fixtures ──────────────────────────────────────────────────────────
const disease: DiseaseRec = {
  name:                'Phytophthora cinnamomi',
  probability:         91,
  detectedAt:          '23 May · 07:23',
  daysBeforeSymptoms:  14,
  action:              'Apply Fosetil-Al 3 g/L · reduce irrigation 30%',
}

const irrigationStressed: IrrigationRec = {
  scheduledFor: 'today 18:00',
  duration:     '20 min',
  reasoning:    'Sap-flow at 41% of baseline — water stress confirmed',
  sapFlowPct:   41,   // < 60 = stressed
}

const irrigationNormal: IrrigationRec = {
  scheduledFor: 'tomorrow 08:00',
  duration:     '35 min',
  reasoning:    'Sap-flow declining for 3 consecutive days',
  sapFlowPct:   68,   // ≥ 60 = not stressed
}

const fertilizer: FertilizerRec = {
  nutrient:     'Nitrogen (N)',
  dose:         '8 g/m²',
  product:      'Ammonium nitrate 27%',
  scheduledFor: '28 May',
}

// ── DiseaseCard ────────────────────────────────────────────────────────────
describe('DiseaseCard', () => {
  test('shows "Disease detected" eyebrow', () => {
    render(<DiseaseCard d={disease} />)
    expect(screen.getByText(/disease detected/i)).toBeInTheDocument()
  })

  test('renders disease name', () => {
    render(<DiseaseCard d={disease} />)
    expect(screen.getByText('Phytophthora cinnamomi')).toBeInTheDocument()
  })

  test('renders probability as percentage', () => {
    render(<DiseaseCard d={disease} />)
    expect(screen.getByText('91%')).toBeInTheDocument()
  })

  test('renders detected date', () => {
    render(<DiseaseCard d={disease} />)
    expect(screen.getByText(/23 May · 07:23/)).toBeInTheDocument()
  })

  test('renders days before visible symptoms', () => {
    render(<DiseaseCard d={disease} />)
    expect(screen.getByText(/14 days before visible symptoms/)).toBeInTheDocument()
  })

  test('renders recommended action text', () => {
    render(<DiseaseCard d={disease} />)
    expect(screen.getByText(/recommended action/i)).toBeInTheDocument()
    expect(screen.getByText(/Fosetil-Al/)).toBeInTheDocument()
  })

  test('shows agronomist notification', () => {
    render(<DiseaseCard d={disease} />)
    expect(screen.getByText(/Dr. M. Conti/)).toBeInTheDocument()
  })

  test('shows "Contact via TropiX" link', () => {
    render(<DiseaseCard d={disease} />)
    expect(screen.getByText(/Contact via TropiX/)).toBeInTheDocument()
  })
})

// ── IrrigationCard ─────────────────────────────────────────────────────────
describe('IrrigationCard', () => {
  test('shows "Irrigation" eyebrow', () => {
    render(<IrrigationCard r={irrigationStressed} />)
    expect(screen.getByText(/irrigation/i)).toBeInTheDocument()
  })

  test('renders scheduled time and duration', () => {
    render(<IrrigationCard r={irrigationStressed} />)
    expect(screen.getByText(/today 18:00 · 20 min/)).toBeInTheDocument()
  })

  test('renders reasoning text', () => {
    render(<IrrigationCard r={irrigationStressed} />)
    expect(screen.getByText(/Sap-flow at 41% of baseline/)).toBeInTheDocument()
  })

  test('renders sap-flow percentage', () => {
    render(<IrrigationCard r={irrigationStressed} />)
    expect(screen.getByText('41%')).toBeInTheDocument()
  })

  test('stressed sap-flow (< 60%) shows percentage in red', () => {
    render(<IrrigationCard r={irrigationStressed} />)
    // toHaveStyle handles both #hex and rgb() normalisation
    expect(screen.getByText('41%')).toHaveStyle({ color: '#B83A2E' })
  })

  test('normal sap-flow (≥ 60%) shows orange #CC5427 bar', () => {
    render(<IrrigationCard r={irrigationNormal} />)
    // The percentage text should be in orange
    const percentEl = screen.getByText('68%')
    expect(percentEl).toHaveStyle({ color: '#CC5427' })
  })

  test('sap-flow label has tooltip about 14-day average', () => {
    render(<IrrigationCard r={irrigationStressed} />)
    const label = screen.getByTitle(/14-day average/i)
    expect(label).toBeInTheDocument()
  })
})

// ── FertilizerCard ─────────────────────────────────────────────────────────
describe('FertilizerCard', () => {
  test('shows "Fertilizer" eyebrow', () => {
    render(<FertilizerCard f={fertilizer} />)
    expect(screen.getByText(/fertilizer/i)).toBeInTheDocument()
  })

  test('renders deficiency nutrient', () => {
    render(<FertilizerCard f={fertilizer} />)
    expect(screen.getByText('Nitrogen (N)')).toBeInTheDocument()
  })

  test('renders dose', () => {
    render(<FertilizerCard f={fertilizer} />)
    expect(screen.getByText('8 g/m²')).toBeInTheDocument()
  })

  test('renders product name', () => {
    render(<FertilizerCard f={fertilizer} />)
    expect(screen.getByText('Ammonium nitrate 27%')).toBeInTheDocument()
  })

  test('renders scheduled date', () => {
    render(<FertilizerCard f={fertilizer} />)
    expect(screen.getByText(/28 May/)).toBeInTheDocument()
  })

  test('renders "Deficiency" and "Dose" labels', () => {
    render(<FertilizerCard f={fertilizer} />)
    expect(screen.getByText('Deficiency')).toBeInTheDocument()
    expect(screen.getByText('Dose')).toBeInTheDocument()
  })
})
