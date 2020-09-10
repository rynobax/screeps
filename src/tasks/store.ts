type State = { type: 'store'; destination: Id<Structure> };

interface StoreCreep extends Creep {
  memory: {
    role: Creep['memory']['role'];
    state: State;
  };
}

const getSpawn = (creep: Creep) => creep.room.find(FIND_MY_SPAWNS)[0];

const store: Task<StoreCreep> = {
  done: (creep) => {
    return !creep.store.getUsedCapacity(RESOURCE_ENERGY);
  },
  possible: (creep) => {
    if (!creep.store.getUsedCapacity(RESOURCE_ENERGY)) return false;
    return !!getSpawn(creep).store.getFreeCapacity(RESOURCE_ENERGY);
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
  initialize: (c) => {
    const creep = c as StoreCreep;
    creep.memory.state = { type: 'store', destination: getSpawn(creep).id };
    return creep;
  },
};

export default store;
