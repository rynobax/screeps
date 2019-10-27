import harvester from './harvester';
import worker from './worker';

type Role = Creep['memory']['role'];

function newName(role: Role) {
  for (let i = 1; i < 2; i++) {
    const name = `${role}_${i}`;
    if (!Game.creeps[name]) return name;
  }
  return String(Math.random());
}

const roleCount = (role: Role) =>
  Object.values(Game.creeps).filter(c => c.memory.role === role).length;

export function spawnCreeps() {
  const spawn = Object.values(Game.spawns)[0];
  if (roleCount('harvester') < 2) {
    spawn.spawnCreep(harvester.body, newName('harvester'), {
      memory: { role: 'harvester' },
    });
  }
  if (roleCount('worker') < 1) {
    spawn.spawnCreep(worker.body, newName('worker'), {
      memory: { role: 'worker' },
    });
  }
}

const creepTypes = {
  harvester,
  worker,
};

export function commandCreeps() {
  Object.values(Game.creeps).forEach(creep => {
    if (creep.spawning) return;
    const { run } = creepTypes[creep.memory.role];
    run(creep as any);
  });
}
