type State = { type: 'store'; destination: string };

interface StoreCreep extends Creep {
  memory: {
    role: Creep['memory']['role'];
    state: State;
  };
}

const getSpawn = (creep: Creep) => creep.room.find(FIND_MY_SPAWNS)[0];

const store: Activity<StoreCreep> = {
  done: creep => {
    return !creep.store.getUsedCapacity();
  },
  possible: creep => {
    if (!creep.store.getUsedCapacity()) return false;
    return !!getSpawn(creep).store.getFreeCapacity();
  },
  run: creep => {
    const home = Game.getObjectById(creep.memory.state.destination);

    if (!(home instanceof Structure)) {
      throw Error('Destination was not a structure');
    }

    if (creep.transfer(home, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(home, { visualizePathStyle: { stroke: '#ffffff' } });
    }
  },
  transition: creep => {
    creep.memory.state = { type: 'store', destination: getSpawn(creep).id };
    return creep.memory;
  },
};

export default store;
