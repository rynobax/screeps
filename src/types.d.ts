// example declaration file - remove these and add your own custom typings
type Role = 'harvester';

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
  // Will return true or false based on if the creep can do this
  possible: (creep: Creep) => boolean;
  // Make the creep do the task
  run: (creep: TCreep) => void;
  // Initialize this task
  initialize: (TCreep: Creep) => TCreep;
}
