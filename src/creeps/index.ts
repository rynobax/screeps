import { doActivity } from '../activities';

type Role = Creep['memory']['role'];

function newName(role: Role) {
  for (let i = 1; i < 100; i++) {
    const name = `${role}_${i}`;
    if (!Game.creeps[name]) return name;
  }
  return String(Math.random());
}

const roleCount = (role: Role) =>
  Object.values(Game.creeps).filter(c => c.memory.role === role).length;

const spawnCreep = (
  spawn: StructureSpawn,
  role: Role,
  body: BodyPartConstant[]
) =>
  spawn.spawnCreep(body, newName('harvester'), {
    memory: {
      role,
      state: { type: 'idle' },
    } as any,
  });

export function spawnCreeps() {
  const spawn = Object.values(Game.spawns)[0];
  if (roleCount('harvester') < 3) {
    spawnCreep(spawn, 'harvester', [WORK, CARRY, MOVE]);
  }
}

const harvesterTasks = [
  'harvest' as const,
  'store' as const,
  'upgrade' as const,
];
const harvester = (creep: Creep) => doActivity(creep, harvesterTasks);

const creepTypes = {
  harvester,
};

export function commandCreeps() {
  Object.values(Game.creeps).forEach(creep => {
    if (creep.spawning) return;
    const run = creepTypes[creep.memory.role];
    run(creep as any);
  });
}
