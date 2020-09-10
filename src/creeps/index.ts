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

const spawnCreep = (
  spawn: StructureSpawn,
  role: Role,
  body: BodyPartConstant[]
) =>
  spawn.spawnCreep(body, newName('harvester'), {
    memory: {
      role,
      state: { type: 'idle' },
    },
  });

function desiredCount(role: Role, spawn: StructureSpawn) {
  switch (role) {
    case 'harvester':
      return spawn.room.find(FIND_SOURCES).length * 3;
    default:
      return 0;
  }
}

type RoleInfo = {
  type: Role;
  runTask: (creep: Creep) => void;
  parts: BodyPartConstant[];
};

const creepTypes: Record<Role, RoleInfo> = {
  harvester: {
    type: 'harvester',
    runTask: (creep: Creep) => doTask(creep, ['harvest', 'store', 'upgrade']),
    parts: [WORK, CARRY, MOVE],
  },
};

export function spawnCreeps() {
  const spawn = Object.values(Game.spawns)[0];

  for (const { type, parts } of Object.values(creepTypes)) {
    const have = roleCount(type);
    const need = desiredCount(type, spawn);
    if (have < need) {
      console.log(`spawning ${type} (${have + 1}/${need})`)
      spawnCreep(spawn, type, parts);
    }
  }

  if (roleCount('harvester') < desiredCount('harvester', spawn)) {
    spawnCreep(spawn, 'harvester', [WORK, CARRY, MOVE]);
  }
}

export function commandCreeps() {
  Object.values(Game.creeps).forEach((creep) => {
    if (creep.spawning) return;
    const run = creepTypes[creep.memory.role].runTask;
    run(creep as any);
  });
}
