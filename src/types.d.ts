// example declaration file - remove these and add your own custom typings
type Role = 'harvester';

// memory extension samples
interface CreepMemory {
  role: Role;
}

interface Memory {
  uuid: number;
  log: any;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}

interface Activity<TCreep extends Creep> {
  done: (creep: TCreep) => boolean;
  possible: (creep: Creep) => boolean;
  run: (creep: TCreep) => void;
  transition: (TCreep: TCreep) => TCreep['memory'];
}
