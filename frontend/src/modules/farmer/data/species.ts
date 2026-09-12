import type { Species } from '../types'

export type SpeciesOption = {
  id: Species
  label: string
  helper: string
  icon: string
}

export const SPECIES_OPTIONS: SpeciesOption[] = [
  {
    id: 'cattle',
    label: 'Cattle',
    helper: 'Cows and bulls',
    icon: '🐄',
  },
  {
    id: 'buffalo',
    label: 'Buffalo',
    helper: 'Buffalo herd',
    icon: '🐃',
  },
  {
    id: 'goat',
    label: 'Goat',
    helper: 'Goats in the farm',
    icon: '🐐',
  },
  {
    id: 'sheep',
    label: 'Sheep',
    helper: 'Sheep in the farm',
    icon: '🐑',
  },
  {
    id: 'poultry',
    label: 'Poultry',
    helper: 'Flock or shed report',
    icon: '🐔',
  },
]

export function isPoultry(species: Species | null): boolean {
  return species === 'poultry'
}

export function speciesLabel(species: Species | null): string {
  return SPECIES_OPTIONS.find((item) => item.id === species)?.label ?? 'Livestock'
}
