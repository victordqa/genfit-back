export const blocks = {
  WOD: {
    name: 'WOD',
    minDurationInM: 10,
    maxDurationInM: 16,
    possibleMods: [
      'EMOM',
      'AMRAP',
      'TABATA',
      '40" on 20" off',
      'n rounds FT',
      'Chipper',
    ],
  },
  Skill: {
    name: 'Skill',
    minDurationInM: 8,
    maxDurationInM: 13,
    possibleMods: ['Core Day', 'Strength', 'Technique'],
  },
  'Warm Up': {
    name: 'Warm up',
    minDurationInM: 4,
    maxDurationInM: 10,
    possibleMods: [
      'EMOM',
      'AMRAP',
      'TABATA',
      '40" on 20" off',
      'n rounds FT',
      'Chipper',
    ],
  },
};
