import harvester from './harvester';

export function spawnCreeps() {
  if (Object.values(Game.creeps).length > 0) return;
  Object.values(Game.spawns).forEach(spawn => {
    spawn.spawnCreep(['work', 'carry', 'move'], 'test', {
      memory: { role: 'harvester' },
    });
  });
}

const creepTypes = {
  harvester,
};

export function commandCreeps() {
  Object.values(Game.creeps).forEach(creep => {
    const fn = creepTypes[creep.memory.role];
    fn(creep);
  });
}
