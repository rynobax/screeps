import harvester from './harvester';

function newName(role: Creep['memory']['role']) {
  for (let i = 1; i < 100; i++) {
    const name = `${role}_${i}`;
    if (!Game.creeps[name]) return name;
  }
  return String(Math.random());
}

export function spawnCreeps() {
  if (Object.values(Game.creeps).length > 10) return;
  Object.values(Game.spawns).forEach(spawn => {
    spawn.spawnCreep(['work', 'carry', 'move'], newName('harvester'), {
      memory: { role: 'harvester' },
    });
  });
}

const creepTypes = {
  harvester,
};

export function commandCreeps() {
  Object.values(Game.creeps).forEach(creep => {
    if (creep.spawning) return;
    const fn = creepTypes[creep.memory.role];
    fn(creep);
  });
}
