type State = { type: 'harvest'; destination: string };

interface HarvestCreep extends Creep {
  memory: {
    role: Creep['memory']['role'];
    state: State;
  };
}

const findEnergySource =  (source: Source) => {
  if (!source.energy) return false;
  if (Object.keys(Memory.harvesters[source.id] || {}).length > 2) return false;
  else return true;
};

function claimSource(source: Source, creep: Creep) {
  if (!Memory.harvesters[source.id]) Memory.harvesters[source.id] = {};
  Memory.harvesters[source.id][creep.name] = true;
}

const harvest: Task<HarvestCreep> = {
  done: creep => {
    return !creep.store.getFreeCapacity();
  },
  possible: creep => {
    if (!creep.store.getFreeCapacity()) return false;
    const sources = creep.room.find(FIND_SOURCES);
    const source = sources.find(findEnergySource);
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
  initialize: creep => {
    const sources = creep.room.find(FIND_SOURCES);
    const source = sources.find(findEnergySource);
    if (source) {
      creep.memory.state = { type: 'harvest', destination: source.id };
      claimSource(source, creep);
    }
    return creep.memory;
  },
};

export default harvest;
