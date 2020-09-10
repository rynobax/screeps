// example declaration file - remove these and add your own custom typings
type Role = 'grunt';

type TaskName = 'idle' | 'harvest' | 'store' | 'upgrade';

// memory extension samples
interface CreepMemory {
  role: Role;
  state: { type: TaskName };
}

interface Memory {
  harvesters: { [mineId: string]: { [creepId: string]: true } };
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}

interface Task<TCreep extends Creep> {
  // Will return true when creep is finished with the current task
  done: (creep: TCreep) => boolean;
  // Make the creep do the task
  run: (creep: TCreep) => void;
  // set up memory and stuff
  initializeIfPossible: (creep: Creep) => TCreep | null;
  // clear memory and stuff
  terminate: (creep: TCreep) => void;
}
