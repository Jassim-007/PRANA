import type { Species } from '../types'

export type SymptomOption = {
  id: string
  label: string
}

const CATTLE_BUFFALO: SymptomOption[] = [
  { id: 'fever', label: 'Fever' },
  { id: 'mouth_lesions', label: 'Mouth sores / lesions' },
  { id: 'excessive_salivation', label: 'Too much saliva' },
  { id: 'lameness', label: 'Limping / cannot walk well' },
  { id: 'loss_of_appetite', label: 'Not eating' },
  { id: 'reduced_milk', label: 'Less milk' },
  { id: 'nasal_discharge', label: 'Runny nose' },
  { id: 'cough', label: 'Cough' },
  { id: 'diarrhea', label: 'Loose dung' },
  { id: 'blisters', label: 'Blisters on feet or mouth' },
  { id: 'sudden_death', label: 'Sudden death' },
  { id: 'swelling', label: 'Swelling' },
]

const GOAT_SHEEP: SymptomOption[] = [
  { id: 'fever', label: 'Fever' },
  { id: 'nasal_discharge', label: 'Runny nose' },
  { id: 'mouth_sores', label: 'Mouth sores' },
  { id: 'diarrhea', label: 'Diarrhea' },
  { id: 'cough', label: 'Cough' },
  { id: 'lameness', label: 'Limping' },
  { id: 'loss_of_appetite', label: 'Not eating' },
  { id: 'skin_lesions', label: 'Skin sores' },
  { id: 'abortion', label: 'Abortion / stillbirth' },
  { id: 'sudden_death', label: 'Sudden death' },
]

const POULTRY: SymptomOption[] = [
  { id: 'sudden_death', label: 'Sudden deaths in the flock' },
  { id: 'respiratory_distress', label: 'Breathing trouble in the shed' },
  { id: 'cough', label: 'Coughing / sneezing in flock' },
  { id: 'reduced_egg_production', label: 'Drop in egg production' },
  { id: 'diarrhea', label: 'Watery droppings' },
  { id: 'nasal_discharge', label: 'Runny nose / discharge' },
  { id: 'swelling_of_head', label: 'Swollen head or eyes' },
  { id: 'paralysis', label: 'Weak or paralyzed birds' },
  { id: 'huddling', label: 'Birds huddling together' },
  { id: 'loss_of_appetite', label: 'Flock not eating well' },
]

export function symptomsForSpecies(species: Species): SymptomOption[] {
  if (species === 'cattle' || species === 'buffalo') return CATTLE_BUFFALO
  if (species === 'goat' || species === 'sheep') return GOAT_SHEEP
  return POULTRY
}
