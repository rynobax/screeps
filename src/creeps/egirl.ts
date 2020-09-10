const shape: RoleShape = {
  type: 'egirl',
  tasks: ['harvest', 'store', 'upgrade'],
  parts: [WORK, CARRY, MOVE],
};

const count = (spawn: StructureSpawn) => {
  return Object.values(spawn.room.memory.harvesters).reduce(
    (p, c) => p + c.max,
    0
  );
};

export default { count, shape };
