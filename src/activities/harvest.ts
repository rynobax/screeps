type State = { type: 'harvest'; destination: string };

interface HarvestCreep extends Creep {
  memory: {
    role: Creep['memory']['role'];
    state: State;
  };
}

const isActiveEnergySource = (creep: Creep) => (source: Source) => {
  if (!source.energy) return false;
  else return true;
};

const harvest: Activity<HarvestCreep> = {
  done: creep => {
    return !creep.store.getFreeCapacity();
  },
  possible: creep => {
    if(!creep.store.getFreeCapacity()) return false;
    const sources = creep.room.find(FIND_SOURCES);
    const source = sources.find(isActiveEnergySource(creep));
    return !!source;
  },
  run: creep => {
    const mine = Game.getObjectById(creep.memory.state.destination);

    if (!(mine instanceof Source)) {
      throw Error('Destination was not a source');
    }

    if (creep.harvest(mine) === ERR_NOT_IN_RANGE) {
      creep.moveTo(mine, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
  },
  transition: creep => {
    const sources = creep.room.find(FIND_SOURCES);
    const source = sources.find(isActiveEnergySource(creep));
    if (source) {
      creep.memory.state = { type: 'harvest', destination: source.id };
    }
    return creep.memory;
  },
};

export default harvest;
