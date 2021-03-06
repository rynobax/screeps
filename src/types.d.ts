// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: Role;
  state: { type: TaskName };
}

interface RoomMemory {
  harvesters: {
    [mineId: string]: {
      max: number;
      claims: {
        [creepId: string]: boolean;
      };
    };
  };
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}

type TaskName = 'idle' | 'harvest' | 'store' | 'upgrade';

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

type Role = 'egirl';

type RoleShape = {
  type: Role;
  tasks: TaskName[];
  parts: BodyPartConstant[];
};

