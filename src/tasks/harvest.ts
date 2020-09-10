type State = { type: 'harvest'; destination: Id<Source> };

interface HarvestCreep extends Creep {
  memory: {
    role: Creep['memory']['role'];
    state: State;
  };
}

const findEnergySource = (source: Source) => {
  if (!source.energy) return false;
  if (Object.keys(Memory.harvesters[source.id] || {}).length > 2) return false;
  else return true;
};

function claimSource(source: Source, creep: Creep) {
  if (!Memory.harvesters[source.id]) Memory.harvesters[source.id] = {};
  Memory.harvesters[source.id][creep.name] = true;
}

function releaseSource(source: Source, creep: Creep) {
  delete Memory.harvesters[source.id][creep.name];
}

function getSource(creep: HarvestCreep) {
  const mine = Game.getObjectById(creep.memory.state.destination);

  if (!mine) {
    throw Error('Destination is null');
  }

  return mine;
}

function possible(creep: Creep) {
  if (!creep.store.getFreeCapacity()) return false;
  const sources = creep.room.find(FIND_SOURCES);
  const source = sources.find(findEnergySource);
  return !!source;
}

const harvest: Task<HarvestCreep> = {
  done: (creep) => {
    return !creep.store.getFreeCapacity();
  },
  run: (creep) => {
    const source = getSource(creep);

    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
  },
  initializeIfPossible: (c) => {
    if (!possible(c)) return null;

    const creep = c as HarvestCreep;
    const sources = creep.room.find(FIND_SOURCES);
    const source = sources.find(findEnergySource);
    if (source) {
      claimSource(source, creep);
      creep.memory.state = { type: 'harvest', destination: source.id };
    }
    return creep;
  },
  terminate: (creep) => {
    const source = getSource(creep);
    releaseSource(source, creep);
  },
};

export default harvest;
