import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AccumulatedLoads,
  CreateTrainningParams,
  ExerciseForCalc,
  IndexedBlocks,
  MaxExParams,
  MusclesRefs,
  ParsedModifiers,
  SuggestTrainningParams,
  TrainningExerciseData,
  TrainningForCalc,
} from '../../../utils/types';
import { DataSource, Repository } from 'typeorm';
import { Box } from '../../../typeOrm/entities/Box';
import { Trainning } from '../../../typeOrm/entities/Trainning';
import { TrainningBlock } from '../../../typeOrm/entities/TrainningBlock';
import { ExercisesService } from '../../../exercises/services/exercises/exercises.service';
import { TrainningBlockExercise } from '../../../typeOrm/entities/TrainningBlockExercise';
import { Exercise } from '../../../typeOrm/entities/Exercise';
import {
  convertExsObjToArray,
  generateRandomInteger,
  indexArray,
  insertOrAcummulate,
  sampleArrayRandomly,
} from '../../../helpers/mathHelpers';
import { Block } from '../../../typeOrm/entities/Block';
import { Modifier } from '../../../typeOrm/entities/Modifier';

@Injectable()
export class TrainningsService {
  // suggested = [] as TrainningForCalc[];
  constructor(
    @InjectRepository(Box) private boxRepository: Repository<Box>,
    @InjectRepository(Trainning)
    private trainningRepository: Repository<Trainning>,
    @InjectRepository(TrainningBlockExercise)
    private trainningBlockExerciseRepository: Repository<TrainningBlockExercise>,
    @InjectRepository(TrainningBlock)
    private trainningBlockRepository: Repository<TrainningBlock>,
    private exercisesService: ExercisesService,
    private dataSource: DataSource,
  ) {}
  async suggestTrainning(suggestTrainningParams: SuggestTrainningParams) {
    //get trainning history from db
    const history = await this.getTrainningHistory(
      suggestTrainningParams.boxId,
    );
    // parse trainning history
    const parsedHistory = this.dbTrainningToCalcTrainningParser(
      history.trainnings,
    );

    const exercises = await this.exercisesService.listExercises(
      suggestTrainningParams.coachId,
    );
    const musclesRefs = (await this.exercisesService.listMuscleRefs()).map(
      (ex) => ({ name: ex.name, loadRefPerTrainning: ex.ref_week_load }),
    );

    const blocks = await this.exercisesService.listBlocksAndPreloads();
    const modifiers = await this.exercisesService.listModifiers();

    const suggestedTrainnings = this.generateTrainning(
      suggestTrainningParams.quantity,
      parsedHistory,
      {
        exercises,
        musclesRefs,
        blocks,
        modifiers,
      },
    );

    const trainningsWithIds = suggestedTrainnings.map((trainning) => {
      const trainningWithBlockIds = Object.entries(trainning).reduce(
        (acc, [blockName, blockDetails]) => {
          let blockId = blocks.filter(
            (b) => b.name === this.convertBlockName(blockName),
          )[0].id;
          let modifierId = modifiers.filter(
            (m) => m.name === blockDetails.modifier,
          )[0].id;
          return {
            ...acc,
            [blockName]: { ...blockDetails, blockId, modifierId },
          };
        },
        {},
      );

      return { trainningWithBlockIds };
    });
    return { boxId: suggestTrainningParams.boxId, trainningsWithIds };
  }

  private generateTrainning(
    quantity: number,
    history: TrainningForCalc[],
    baseParams: {
      exercises: Exercise[];
      musclesRefs: MusclesRefs;
      blocks: Block[];
      modifiers: Modifier[];
    },
    suggested: TrainningForCalc[] = [],
  ): TrainningForCalc[] {
    if (quantity === 0) {
      return suggested;
    }

    const { exercises, musclesRefs, blocks, modifiers } = baseParams;
    // console.dir(exercises, { depth: null });
    const parsedExercises = this.exerciseDbToExerciseForCalcParser(exercises);

    const lastTrainnings = history.slice(-2);
    const totalReps = this.computeTotalReps(lastTrainnings, parsedExercises);

    const { accumulatedTrainningLoads } = this.calculateTrainningLoad(
      totalReps,
      parsedExercises,
    );

    const maxExParams = this.defineMaxExParams(
      accumulatedTrainningLoads,
      musclesRefs,
    );

    const exercisesArray = convertExsObjToArray(parsedExercises);
    const parsedBlocks = blocks.map((b) => {
      const possibleMods = b.modifiers.map((m) => m.name);
      return {
        name: b.name,
        possibleMods,
        minDurationInM: b.min_duration_in_m,
        maxDurationInM: b.max_duration_in_m,
      };
    });

    const indexedBlocks = indexArray(parsedBlocks, 'name');

    const parsedModifiers = modifiers.reduce(
      (acc, mod) => ({
        ...acc,
        [mod.name]: {
          minCandidates: mod.min_candidates,
          maxCandidates: mod.max_candidates,
        },
      }),
      {},
    );

    //define wod
    const [wodModifier] = this.defineModifier(
      totalReps,
      indexedBlocks.WOD.possibleMods,
      'wod',
    );
    const wodExs = this.filterByBlock(exercisesArray, 'WOD');

    const wodCandidates = this.applyFilters(
      wodExs,
      history,
      maxExParams,
      wodModifier,
      parsedModifiers,
    );

    const indexedExercises = indexArray(parsedExercises, 'id');

    const wod = this.generateBlock(
      wodCandidates,
      wodModifier,
      'WOD',
      parsedModifiers,
      indexedBlocks,
      indexedExercises,
    );
    // console.dir(wod, { depth: null });

    //define SKILL
    const [skillModifier] = this.defineModifier(
      totalReps,
      indexedBlocks.Skill.possibleMods,
      'skill',
    );
    const skillExs = this.filterByBlock(exercisesArray, 'Skill');
    const skillCandidates = this.applyFilters(
      skillExs,
      history,
      maxExParams,
      skillModifier,
      parsedModifiers,
    );

    const skill = this.generateBlock(
      skillCandidates,
      skillModifier,
      'Skill',
      parsedModifiers,
      indexedBlocks,
      indexedExercises,
    );

    //define warm up
    const [warmUpModifier] = this.defineModifier(
      totalReps,
      indexedBlocks['Warm Up'].possibleMods,
      'warmUp',
    );
    const warmUpExs = this.filterByBlock(exercisesArray, 'Warm Up');
    const warmUpCandidates = this.applyFilters(
      warmUpExs,
      history,
      maxExParams,
      warmUpModifier,
      parsedModifiers,
    );
    const warmUp = this.generateBlock(
      warmUpCandidates,
      warmUpModifier,
      'Warm Up',
      parsedModifiers,
      indexedBlocks,
      indexedExercises,
    );

    const generatedTrainning = { warmUp, skill, wod };

    const totalRepsHistory = this.computeTotalReps(history, parsedExercises);
    const accumulatedTrainningLoadsHistory = this.calculateTrainningLoad(
      totalRepsHistory,
      parsedExercises,
    );

    suggested.push(generatedTrainning);
    return this.generateTrainning(
      quantity - 1,
      history.concat(generatedTrainning),
      baseParams,
      suggested,
    );
  }

  private defineNumberOfSamples(
    modifier: string,
    numberOfCandidates: number,
    modifiers: ParsedModifiers,
  ) {
    let numberOfSamples = generateRandomInteger(
      modifiers[modifier].maxCandidates,
      modifiers[modifier].minCandidates,
    );

    if (numberOfCandidates < numberOfSamples)
      numberOfSamples = numberOfCandidates;
    return numberOfSamples;
  }

  private generateBlock(
    candidates: ExerciseForCalc[],
    modifier: string,
    block: string,
    modifiers: ParsedModifiers,
    blocks: IndexedBlocks,
    exercises: { [key: number]: ExerciseForCalc },
  ) {
    //checks for each mod and implements their rules

    if (modifier === 'EMOM') {
      const numberOfSamples = this.defineNumberOfSamples(
        modifier,
        candidates.length,
        modifiers,
      );
      const selection = sampleArrayRandomly(candidates, numberOfSamples);
      const maxDurationPerBlock = 45;

      const blockExercises = selection.map((sel) => {
        return {
          id: sel.id,
          name: sel.name,
          reps: Math.round(maxDurationPerBlock / sel.timePerRepInS),
          load: 0.5,
        };
      });

      const minDuration = blocks[block].minDurationInM;
      const maxDuration = blocks[block].maxDurationInM;
      const targetDuration = generateRandomInteger(maxDuration, minDuration);

      const multiple = Math.trunc(targetDuration / selection.length);

      const durationInM = multiple * selection.length;

      return { exercises: blockExercises, modifier: 'EMOM', durationInM };
    }

    if (modifier === 'Strength') {
      // filter to leave candidates that have high impact on muscles
      let filterLooseness = 0;
      let numberOfCandidates = 0;
      const initialFilter = 4;
      let candidatesByImpact = [...candidates];
      while (
        numberOfCandidates < modifiers[modifier].minCandidates &&
        filterLooseness <= 5
      ) {
        candidatesByImpact = candidatesByImpact.filter((candidate) => {
          const highestImpact = candidate.musclesTargeted.reduce(
            (acc, ex) =>
              (ex.name !== 'abs' && (ex.impact > acc ? ex.impact : acc)) || acc,
            0,
          );
          return highestImpact >= initialFilter - filterLooseness;
        });
        numberOfCandidates = candidatesByImpact.length;
        filterLooseness++;
      }

      const numberOfSamples = this.defineNumberOfSamples(
        modifier,
        candidatesByImpact.length,
        modifiers,
      );

      const selection = sampleArrayRandomly(
        candidatesByImpact,
        numberOfSamples,
      );

      const blockExercises = selection.map((sel) => {
        return {
          id: sel.id,
          name: sel.name,
          reps: generateRandomInteger(30, 25),
          load: 0.8,
        };
      });

      return {
        exercises: blockExercises,
        modifier: 'Strength',
        durationInM: generateRandomInteger(10, 8), // here duration is simbolic, what matters is total reps
      };
    }

    if (modifier === 'n rounds FT') {
      const numberOfSamples = this.defineNumberOfSamples(
        modifier,
        candidates.length,
        modifiers,
      );
      const selection = sampleArrayRandomly(candidates, numberOfSamples);

      const minDuration = blocks[block].minDurationInM;
      const maxDuration = blocks[block].maxDurationInM;
      const targetDuration = generateRandomInteger(maxDuration, minDuration);

      // high impact exercises should have less reps
      const blockExercises = selection.map((sel) => {
        const highestImpact = sel.musclesTargeted.reduce(
          (acc, exInfo) => (exInfo.impact > acc ? exInfo.impact : acc),
          0,
        );
        return {
          id: sel.id,
          name: sel.name,
          reps: Math.round((generateRandomInteger(30, 25) / highestImpact) * 2),
          load: 0.5,
        };
      });

      return {
        exercises: blockExercises,
        modifier: 'n rounds FT',
        durationInM: targetDuration,
      };
    }

    if (modifier === 'Chipper') {
      const numberOfSamples = this.defineNumberOfSamples(
        modifier,
        candidates.length,
        modifiers,
      );
      const selection = sampleArrayRandomly(candidates, numberOfSamples);

      // high impact exercises shoul have less reps
      const blockExercises = selection.map((sel) => {
        const highestImpact = sel.musclesTargeted.reduce(
          (acc, exInfo) => (exInfo.impact > acc ? exInfo.impact : acc),
          0,
        );
        return {
          id: sel.id,
          name: sel.name,
          reps: Math.round(generateRandomInteger(40, 30)),
          load: highestImpact >= 4 ? 0.3 : 0.5,
        };
      });

      const roundDuration = blockExercises.reduce((acc, ex) => {
        return (acc += exercises[ex.id].timePerRepInS * ex.reps);
      }, 0);
      return {
        exercises: blockExercises,
        modifier: 'Chipper',
        durationInM: Math.round(roundDuration / 60),
      };
    }

    if (modifier === '40" on 20" off') {
      const numberOfSamples = this.defineNumberOfSamples(
        modifier,
        candidates.length,
        modifiers,
      );
      const selection = sampleArrayRandomly(candidates, numberOfSamples);
      const maxDurationPerBlock = 40;

      const blockExercises = selection.map((sel) => {
        return {
          id: sel.id,
          name: sel.name,
          reps: Math.round(maxDurationPerBlock / sel.timePerRepInS),
          load: 0.5,
        };
      });

      const minDuration = blocks[block].minDurationInM;
      const maxDuration = blocks[block].maxDurationInM;
      const targetDuration = generateRandomInteger(maxDuration, minDuration);

      const multiple = Math.trunc(targetDuration / selection.length);

      const durationInM = multiple * selection.length;

      return {
        exercises: blockExercises,
        modifier: '40" on 20" off',
        durationInM,
      };
    }

    if (modifier === 'TABATA') {
      const numberOfSamples = this.defineNumberOfSamples(
        modifier,
        candidates.length,
        modifiers,
      );
      const selection = sampleArrayRandomly(candidates, numberOfSamples);
      const maxDurationPerBlock = 20;

      const blockExercises = selection.map((sel) => {
        return {
          id: sel.id,
          name: sel.name,
          reps: Math.round(maxDurationPerBlock / sel.timePerRepInS),
          load: 0.5,
        };
      });

      const maxDuration = blocks[block].maxDurationInM;
      let durationInM = 4;
      if (numberOfSamples <= 2) durationInM = 4;
      if (2 < numberOfSamples && numberOfSamples <= 4) durationInM = 8;
      if (numberOfSamples > 4) durationInM = 12;

      return { exercises: blockExercises, modifier: 'TABATA', durationInM };
    }

    if (modifier === 'AMRAP') {
      const numberOfSamples = this.defineNumberOfSamples(
        modifier,
        candidates.length,
        modifiers,
      );
      const selection = sampleArrayRandomly(candidates, numberOfSamples);

      const minDuration = blocks[block].minDurationInM;
      const maxDuration = blocks[block].maxDurationInM;
      const targetDuration = generateRandomInteger(maxDuration, minDuration);

      // high impact exercises shoul have less reps
      const blockExercises = selection.map((sel) => {
        const highestImpact = sel.musclesTargeted.reduce(
          (acc, exInfo) => (exInfo.impact > acc ? exInfo.impact : acc),
          0,
        );
        return {
          id: sel.id,
          name: sel.name,
          reps: Math.round((generateRandomInteger(30, 25) / highestImpact) * 2),
          load: 0.5,
        };
      });

      return {
        exercises: blockExercises,
        modifier: 'AMRAP',
        durationInM: targetDuration,
      };
    }

    if (modifier === 'Technique') {
      // filter to leave candidates that are complex and need work on techinique
      let filterLooseness = 0;
      let numberOfCandidates = 0;
      const initialFilter = 4;
      let candidatesByComplexity = [...candidates];
      while (
        numberOfCandidates < modifiers[modifier].minCandidates &&
        filterLooseness <= 5
      ) {
        candidatesByComplexity = candidatesByComplexity.filter(
          (candidate) =>
            candidate.complexity >= initialFilter - filterLooseness,
        );
        numberOfCandidates = candidatesByComplexity.length;
        filterLooseness++;
      }

      const numberOfSamples = this.defineNumberOfSamples(
        modifier,
        candidatesByComplexity.length,
        modifiers,
      );
      if (numberOfSamples === 0) candidatesByComplexity = candidates;
      const selection = sampleArrayRandomly(
        candidatesByComplexity,
        numberOfSamples,
      );

      // high impact exercises should have less reps
      const blockExercises = selection.map((sel) => {
        const highestImpact = sel.musclesTargeted.reduce(
          (acc, exInfo) => (exInfo.impact > acc ? exInfo.impact : acc),
          0,
        );
        return {
          id: sel.id,
          name: sel.name,
          reps: Math.round((generateRandomInteger(50, 35) / highestImpact) * 2),
          load: 0.3,
        };
      });

      return {
        exercises: blockExercises,
        modifier: 'Technique',
        durationInM: 10,
      };
    }

    if (modifier === 'Core Day') {
      //leave candidates that work out the core and are high in cardio
      let filterLooseness = 0;
      let numberOfCandidates = 0;
      const initialFilter = 3;
      let candidatesByImpact = [...candidates];
      while (
        numberOfCandidates < modifiers[modifier].minCandidates &&
        filterLooseness <= 5
      ) {
        candidatesByImpact = candidatesByImpact.filter((candidate) => {
          const indexedMuscleTargetsindexArray = indexArray(
            candidate.musclesTargeted,
            'name',
          );

          return (
            indexedMuscleTargetsindexArray['abdominal'] &&
            indexedMuscleTargetsindexArray['abdominal'].impact >=
              initialFilter - filterLooseness
          );
        });
        numberOfCandidates = candidatesByImpact.length;
        filterLooseness++;
      }

      // console.log('========');
      // console.log(modifier);
      // console.log(candidatesByImpact.length);
      // console.log(modifiers);

      const numberOfSamples = this.defineNumberOfSamples(
        modifier,
        candidatesByImpact.length,
        modifiers,
      );

      const selection = sampleArrayRandomly(
        candidatesByImpact,
        numberOfSamples,
      );
      const blockExercises = selection.map((sel) => {
        const highestImpact = sel.musclesTargeted.reduce(
          (acc, exInfo) => (exInfo.impact > acc ? exInfo.impact : acc),
          0,
        );
        return {
          id: sel.id,
          name: sel.name,
          reps: Math.round((generateRandomInteger(60, 40) / highestImpact) * 2),
          load: 0.3,
        };
      });

      const roundDuration = blockExercises.reduce((acc, ex) => {
        return (acc += exercises[ex.id].timePerRepInS * ex.reps);
      }, 0);
      return {
        exercises: blockExercises,
        modifier: 'Core Day',
        durationInM: Math.round(roundDuration / 60),
      };
    }
  }

  private applyFilters(
    exercises: ExerciseForCalc[],
    history: TrainningForCalc[],
    maxExParams: MaxExParams,
    modifierName: string,
    modifiers: ParsedModifiers,
  ) {
    const miminumPoolQuantity = modifiers[modifierName].minCandidates;
    let maxMuscleImpactFilterLooseness = 0;
    let noRepetitionsInLastTrainnings = 4;
    let numberOfCandidates = 0;
    let candidates = [...exercises];

    while (
      numberOfCandidates < miminumPoolQuantity &&
      maxMuscleImpactFilterLooseness <= 2 &&
      noRepetitionsInLastTrainnings > 1
    ) {
      candidates = this.filterExercisesByMaxImpact(
        candidates,
        maxExParams,
        maxMuscleImpactFilterLooseness,
      );
      //filter repetitions
      candidates = this.filterRepeatedExercises(
        candidates,
        history,
        noRepetitionsInLastTrainnings,
      );

      numberOfCandidates = candidates.length;
      maxMuscleImpactFilterLooseness =
        maxMuscleImpactFilterLooseness === 2
          ? 2
          : maxMuscleImpactFilterLooseness + 0.5;
      noRepetitionsInLastTrainnings -= 1;
    }

    return numberOfCandidates > miminumPoolQuantity ? candidates : exercises;
  }

  private filterRepeatedExercises(
    exercises: ExerciseForCalc[],
    history: TrainningForCalc[],
    numberOfPastTrainnings: number,
  ) {
    const lastTrainnings = history.slice(-numberOfPastTrainnings);
    const lastExsIds = lastTrainnings
      .map((trainning) => {
        let arr = [
          ...trainning.warmUp.exercises,
          ...trainning.skill.exercises,
          ...trainning.wod.exercises,
        ];
        return arr.map((ex) => ex.id);
      })
      .flat();

    exercises.filter((ex) => lastExsIds.includes(ex.id));
    return exercises.filter((ex) => {
      return !lastExsIds.includes(ex.id);
    });
  }

  private filterExercisesByMaxImpact(
    exercises: ExerciseForCalc[],
    maxExParams: MaxExParams,
    filterLooseness: number,
  ) {
    const exsMuscleTargetsIndexed = exercises.map((ex) =>
      indexArray(ex.musclesTargeted, 'name'),
    );

    const comparisionMatrixes = exsMuscleTargetsIndexed.map((muscles) => {
      return maxExParams.map((maxExParam) => {
        return (
          (muscles[maxExParam.name] ? true : false) &&
          muscles[maxExParam.name].impact >
            maxExParam.maxImpact + filterLooseness
        );
      });
    });

    const filterArray = comparisionMatrixes.map((arr) => !arr.includes(true));

    return exercises.filter((_ex, index) => {
      return filterArray[index];
    });
  }

  private filterByBlock(exercises: ExerciseForCalc[], block: string) {
    const candidates = exercises.filter((exInfo) =>
      exInfo.blocks.includes(block),
    );

    return candidates.length ? candidates : exercises;
  }

  private defineModifier(
    lastTrainnings: TrainningForCalc[],
    possibleMods: string[],
    blockName: string,
  ) {
    let candidates = possibleMods;
    let numberOfCandidates = 0;
    let displacement = 0;

    while (numberOfCandidates < 1 && displacement < 10) {
      const lastMods = lastTrainnings.map(
        (trainning) => trainning[blockName].modifier,
      );
      candidates = possibleMods.filter(
        (mod) => !lastMods.slice(displacement).includes(mod),
      );

      numberOfCandidates = candidates.length;
      displacement++;
    }
    candidates = numberOfCandidates > 0 ? candidates : possibleMods;
    return sampleArrayRandomly(candidates);
  }

  private defineMaxExParams(
    accumulatedLoads: AccumulatedLoads,
    musclesRefs: { name: string; loadRefPerTrainning: number }[],
  ) {
    const indexed = indexArray(musclesRefs, 'name');

    const maxExParams = Object.entries(accumulatedLoads).map(
      ([accName, accLoad]) => {
        const relativeLoad = accLoad / indexed[accName].loadRefPerTrainning;
        const maxImpact = this.mapExerciseLoadToAvoidability(relativeLoad);
        return { name: accName, maxImpact };
      },
    );
    return maxExParams;
  }

  private mapExerciseLoadToAvoidability(relativeLoad: number) {
    // where the returned value is how avoidable an exercise should be for the next trainning section
    // eg if the previous 2 workouts result in a relative work load of 200% the reference for front leg muscle,
    //  then it will have a high maxImpact for the next trainning section

    let maxImpact = 5;
    if (0.15 < relativeLoad && relativeLoad <= 0.3) maxImpact = 4;

    if (0.3 < relativeLoad && relativeLoad <= 0.45) maxImpact = 3;

    if (0.45 < relativeLoad && relativeLoad <= 0.6) maxImpact = 2;

    if (0.6 < relativeLoad && relativeLoad <= 0.9) maxImpact = 1;

    if (0.9 < relativeLoad) maxImpact = 0;

    return maxImpact;
  }

  private calculateTrainningLoad(
    trainnings: TrainningForCalc[],
    exercises: ExerciseForCalc[],
  ) {
    const partialTrainningLoads = trainnings.map((trainning) => {
      let warmUpExs = trainning.warmUp.exercises;
      let skillExs = trainning.skill.exercises;
      let wodExs = trainning.wod.exercises;
      return this.calculateBlockLoad(
        warmUpExs.concat(skillExs, wodExs),
        exercises,
      );
    });

    const accumulatedTrainningLoads = partialTrainningLoads.reduce(
      (acc, partial: { [index: string]: number }) => {
        for (const [key, value] of Object.entries(partial)) {
          acc = insertOrAcummulate(key, value, acc);
        }
        return acc;
      },
      {},
    );
    return { partialTrainningLoads, accumulatedTrainningLoads };
  }

  private calculateBlockLoad(
    exs: TrainningExerciseData['exercises'],
    exercises: ExerciseForCalc[],
  ) {
    return exs.reduce((acc, ex) => {
      //get ex by id

      const [exCompleteInfo] = exercises.filter((dbEx) => ex.id === dbEx.id);
      let muscleLoads = exCompleteInfo.musclesTargeted.map((muscle) => {
        let muscleLoad = muscle.impact * ex.reps * ex.load;
        return { name: muscle.name, load: muscleLoad };
      });
      muscleLoads.forEach(
        (muscle) => (acc = insertOrAcummulate(muscle.name, muscle.load, acc)),
      );
      return acc;
    }, {});
  }

  private computeTotalReps(
    trainning: TrainningForCalc[],
    parsedExercises: ExerciseForCalc[],
  ) {
    return trainning.map((trainning) => {
      const blocks = ['warmUp', 'skill', 'wod'];
      const explicitReps = Object.assign({}, trainning);
      for (let blockName of blocks) {
        explicitReps[blockName] = this.computeBlockTotalReps(
          trainning[blockName],
          parsedExercises,
        );
      }
      return explicitReps;
    });
  }

  private exerciseDbToExerciseForCalcParser(dbExercises: Exercise[]) {
    const parsedExs = dbExercises.map((dbEx) => {
      const musclesTargeted = dbEx.exercise_muscle_impact.map((emi) => ({
        name: emi.muscle.name,
        impact: emi.impact,
      }));

      const blocks = dbEx.blocks.map((b) => b.name);

      return {
        id: dbEx.id,
        name: dbEx.name,
        complexity: dbEx.complexity,
        musclesTargeted,
        timePerRepInS: dbEx.time_per_rep_s,
        blocks,
      };
    });
    return parsedExs;
  }

  private computeBlockTotalReps(
    block: TrainningExerciseData,
    exercises: ExerciseForCalc[],
  ) {
    const modifier = block.modifier;
    if (modifier === 'EMOM') {
      const numberOfRounds = Math.round(
        block.durationInM / block.exercises.length,
      );

      return {
        ...block,
        exercises: block.exercises.map((bex) => {
          return { ...bex, reps: bex.reps * numberOfRounds };
        }),
      };
    }

    if (modifier === 'AMRAP') {
      //compute block total duration
      const roundDuration = block.exercises.reduce((acc, ex) => {
        const [exCompleteInfo] = exercises.filter((dbEx) => ex.id === dbEx.id);
        return (acc += exCompleteInfo.timePerRepInS * ex.reps);
      }, 0);
      const numberOfRounds = Math.round(
        (block.durationInM * 60) / roundDuration,
      );
      //multiply each rep by the number of rounds

      return {
        ...block,
        exercises: block.exercises.map((bex) => {
          return { ...bex, reps: bex.reps * numberOfRounds };
        }),
      };
    }

    if (modifier === 'TABATA') {
      const numberOfExercises = block.exercises.length;
      const totalTime = numberOfExercises > 2 ? 8 : 4;

      const numberOfRounds = Math.round((totalTime / numberOfExercises) * 2);

      return {
        ...block,
        exercises: block.exercises.map((bex) => {
          return { ...bex, reps: bex.reps * numberOfRounds };
        }),
      };
    }

    if (modifier === '40" on 20" off') {
      const numberOfExercises = block.exercises.length;
      const totalTime = block.durationInM;
      const numberOfRounds = totalTime / numberOfExercises;

      return {
        ...block,
        exercises: block.exercises.map((bex) => {
          return { ...bex, reps: bex.reps * numberOfRounds };
        }),
      };
    }

    if (modifier === 'n rounds FT') {
      const roundDuration = block.exercises.reduce((acc, ex) => {
        const [exCompleteInfo] = exercises.filter((dbEx) => ex.id === dbEx.id);
        return (acc += exCompleteInfo.timePerRepInS * ex.reps);
      }, 0);
      const numberOfRounds = Math.round(
        (block.durationInM * 60) / roundDuration,
      );
      //multiply each rep by the number of rounds

      //chipper strength and techinique dont need to be computed as their reps already are their total reps

      return {
        ...block,
        exercises: block.exercises.map((bex) => {
          return { ...bex, reps: bex.reps * numberOfRounds };
        }),
      };
    }

    return block;
  }

  private convertBlockName(name: string) {
    if (name === 'WOD') return 'wod';
    if (name === 'Skill') return 'skill';
    if (name === 'Warm Up') return 'warmUp';
    if (name === 'wod') return 'WOD';
    if (name === 'skill') return 'Skill';
    if (name === 'warmUp') return 'Warm Up';
  }
  private dbTrainningToCalcTrainningParser(trainnings: Trainning[]) {
    //parse from db format to the format used in the service calculations so we can reutilize those functions

    return trainnings.map((trainning) => {
      let calcTrainning = {} as TrainningForCalc;
      trainning.trainningBlocks.forEach((trainningBlock) => {
        let blockName = this.convertBlockName(trainningBlock.block.name);
        let blockId = trainningBlock.id;
        let blockDuration = trainningBlock.duration_in_m;
        let blockModifierName = trainningBlock.modifier.name;
        let blockModifierId = trainningBlock.modifierId;

        let blockExercises = trainningBlock.trainningBlockExercises.map(
          (ex) => {
            let reps = ex.reps;
            let load = ex.load;
            let id = ex.exerciseId;
            return { reps, load, id };
          },
        );
        calcTrainning[blockName] = {
          durationInM: blockDuration,
          modifier: blockModifierName,
          modifierId: blockModifierId,
          blockId,
          exercises: blockExercises,
        };
        // now structure block info and add it to calcTrainning
        //add the info needed below, adapt type of calc funcs to accept them
      });
      return calcTrainning;
    });
  }

  async getTrainningHistory(boxId: number) {
    const trainnings = await this.boxRepository.findOne({
      where: { id: boxId },
      relations: {
        trainnings: {
          trainningBlocks: {
            trainningBlockExercises: {
              exercise: { exercise_muscle_impact: true },
            },
            block: true,
            modifier: true,
          },
        },
      },
    });
    // console.dir(trainnings, { depth: null });
    return trainnings;
  }

  async createTrainning(createTrainningParams: CreateTrainningParams) {
    const { boxId, trainnings } = createTrainningParams;

    console.log(trainnings);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const savedTrainnings = await Promise.all(
        trainnings.map(async (trainning) => {
          const trainningInstance = this.trainningRepository.create({ boxId });
          const savedTrainning = await queryRunner.manager.save(
            trainningInstance,
          );
          console.log('trainning: ', savedTrainning);
          await Promise.all(
            Object.entries(trainning.trainningWithBlockIds).map(
              async ([_blockName, block]) => {
                const trainningBlockInstance =
                  this.trainningBlockRepository.create({
                    duration_in_m: block.durationInM,
                    blockId: block.blockId,
                    modifierId: block.modifierId,
                  });
                trainningBlockInstance.trainning = trainningInstance;
                let savedTrainningBlock = await queryRunner.manager.save(
                  trainningBlockInstance,
                );

                let exercisesInstances = block.exercises.map((exercise) => {
                  return this.trainningBlockExerciseRepository.create({
                    trainningBlockId: savedTrainningBlock.id,
                    exerciseId: exercise.id,
                    reps: exercise.reps,
                    load: exercise.load,
                  });
                });
                await queryRunner.manager.save(exercisesInstances);
              },
            ),
          );
          await queryRunner.commitTransaction();
          return savedTrainning;
        }),
      );
      return savedTrainnings;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error on training creation');
    } finally {
      await queryRunner.release();
    }
  }
}
