export const modifiers = {
  EMOM: { minCandidates: 2, maxCandidates: 3 }, // every  exercise block has to last for less than 50 s aprox, total duration has to be multiple of block
  AMRAP: { minCandidates: 2, maxCandidates: 6 }, // every  exercise block has to last for less than 100 s aprox, total duration has to be close to 3 block rounds
  TABATA: { minCandidates: 2, maxCandidates: 6 }, // blocks must last aprox 20 s (20` 10`) taotal duration is 4'
  '40" on 20" off': { minCandidates: 1, maxCandidates: 3 }, // blocks must last aprox 45s
  'n rounds FT': { minCandidates: 2, maxCandidates: 4 }, //total ex duration should be close to give For Time
  Strength: { minCandidates: 1, maxCandidates: 2 }, // consider heavy load
  Chipper: { minCandidates: 4, maxCandidates: 6 }, // similar
  'Core Day': { minCandidates: 3, maxCandidates: 6 }, // enphasis in core, chipper style
  Technique: { minCandidates: 1, maxCandidates: 2 },
};
