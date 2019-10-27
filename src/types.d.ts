// example declaration file - remove these and add your own custom typings

type Role = 'harvester';

// memory extension samples
interface CreepMemory {
  role: Role;
  destination?: string;
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
