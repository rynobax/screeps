import { BODY_PART_COST } from 'utils/constants';
import { doTask } from '../tasks';

type Role = Creep['memory']['role'];

function newName(role: Role) {
  for (let i = 1; i < 100; i++) {
    const name = `${role}_${i}`;
    if (!Game.creeps[name]) return name;
  }
  return String(Math.random());
}

const roleCount = (role: Role) =>
  Object.values(Game.creeps).filter((c) => c.memory.role === role).length;

const spawnCreepIfNeeded = (
  spawn: StructureSpawn,
  role: Role,
  bodyParts: BodyPartConstant[]
) => {
  const haveCount = roleCount(role);
  const neededCount = desiredCount(role, spawn);

  // Don't spawn if we have enough
  if (haveCount >= neededCount) return;

  const neededEnergy = bodyParts.reduce((p, c) => p + BODY_PART_COST[c], 0);
  const haveEnergy = spawn.store[RESOURCE_ENERGY];

  // Don't spawn if don't have enough energy
  if(haveEnergy < neededEnergy) return;

  // Don't spawn if already spawning
  if(spawn.spawning) return;

  console.log(`spawning ${role} (${haveCount + 1}/${neededCount})`);
  spawn.spawnCreep(bodyParts, newName('egirl'), {
    memory: {
      role,
      state: { type: 'idle' },
    },
  });
};

function desiredCount(role: Role, spawn: StructureSpawn) {
  switch (role) {
    case 'egirl':
      return spawn.room.find(FIND_SOURCES).length * 3;
    default:
      return 0;
  }
}

type RoleInfo = {
  type: Role;
  tasks: TaskName[];
  parts: BodyPartConstant[];
};

export const creepTypes: Record<Role, RoleInfo> = {
  egirl: {
    type: 'egirl',
    tasks: ['harvest', 'store', 'upgrade'],
    parts: [WORK, CARRY, MOVE],
  },
};

export function spawnCreeps() {
  const spawn = Object.values(Game.spawns)[0];

  for (const { type, parts } of Object.values(creepTypes)) {
    spawnCreepIfNeeded(spawn, type, parts);
  }
}

export function commandCreeps() {
  Object.values(Game.creeps).forEach((creep) => {
    if (creep.spawning) return;
    doTask(creep, creepTypes[creep.memory.role].tasks);
  });
}
