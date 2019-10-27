// example declaration file - remove these and add your own custom typings

type Role = 'harvester' | 'worker';

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
