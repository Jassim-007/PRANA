export const FIELD_WORKER_BASE = '/field-worker'

export const DEFAULT_FIELD_WORKER_ID = 'FW001'

export const WORKER_ID_STORAGE_KEY = 'prana.fieldWorkerId'

export const EVENT_TYPE_LABELS: Record<string, string> = {
  illness: 'Illness / symptoms',
  death: 'Death',
  recovery: 'Recovered animals',
  production_drop: 'Reduced production',
  vaccination: 'Vaccination',
  treatment: 'Treatment',
  animal_movement: 'Animal movement',
  new_animal: 'New animals',
  unusual_observation: 'Unusual observation',
}

export const SYMPTOM_LABELS: Record<string, string> = {
  fever: 'Fever',
  mouth_lesions: 'Mouth lesions',
  lameness: 'Lameness',
  nasal_discharge: 'Nasal discharge',
  reduced_appetite: 'Reduced appetite',
  diarrhea: 'Diarrhea',
  coughing: 'Coughing',
  swelling: 'Swelling',
  discharge: 'Discharge',
  sudden_weakness: 'Sudden weakness',
}

export const SPECIES_LABELS: Record<string, string> = {
  cattle: 'Cattle',
  buffalo: 'Buffalo',
  goat: 'Goat',
  sheep: 'Sheep',
  poultry: 'Poultry',
}

export const DECISION_SUPPORT_NOTICE =
  'Recorded observations support early warning and decision support. They are not a confirmed diagnosis.'
