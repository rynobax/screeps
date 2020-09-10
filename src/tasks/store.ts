type State = { type: 'store'; destination: Id<Structure> };

interface StoreCreep extends Creep {
  memory: {
    role: Creep['memory']['role'];
    state: State;
  };
}

const getSpawn = (creep: Creep) => creep.room.find(FIND_MY_SPAWNS)[0];

function possible(creep: Creep) {
  if (!creep.store.getUsedCapacity(RESOURCE_ENERGY)) return false;
  return !!getSpawn(creep).store.getFreeCapacity(RESOURCE_ENERGY);
}

const store: Task<StoreCreep> = {
  done: (creep) => {
    const creepIsEmpty = !creep.store.getUsedCapacity(RESOURCE_ENERGY);
    const targetIsFull = !getSpawn(creep).store.getFreeCapacity(RESOURCE_ENERGY);
    return creepIsEmpty || targetIsFull;
  },
  run: (creep) => {
    const home = Game.getObjectById(creep.memory.state.destination);

    if (!home) {
      throw Error('Destination was null');
    }

    if (creep.transfer(home, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(home, { visualizePathStyle: { stroke: '#ffffff' } });
    }
  },
  initializeIfPossible: (c) => {
    if(!possible(c)) return null;

    const creep = c as StoreCreep;
    creep.memory.state = { type: 'store', destination: getSpawn(creep).id };
    return creep;
  },
  terminate: () => null,
};

export default store;
