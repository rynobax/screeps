type State =
  | { type: 'collect'; destination: string }
  | { type: 'return'; destination: string }
  | { type: 'idle' };

interface HarvesterCreep extends Creep {
  memory: {
    role: 'harvester';
    state: State;
  };
}

const transitionTo: Record<State['type'], (creep: HarvesterCreep) => void> = {
  collect: creep => {
    const sources = creep.room.find(FIND_SOURCES);
    const source = sources.find(isActiveEnergySource(creep));
    if (source) {
      creep.say('collecting');
      creep.memory.state = { type: 'collect', destination: source.id };
    }
  },
  idle: creep => {
    creep.say('idling');
    creep.memory.state = { type: 'idle' };
  },
  return: creep => {
    const [target] = creep.room.find(FIND_STRUCTURES, {
      filter: isTargetStructure,
    });
    if (target) {
      creep.say('returning');
      creep.memory.state = { type: 'return', destination: target.id };
    }
  },
};

function harvester(creep: HarvesterCreep) {
  // Try to not be idle
  if (creep.memory.state.type === 'idle') {
    if (hasFreeCapacity(creep.store, RESOURCE_ENERGY))
      transitionTo.collect(creep);
    else transitionTo.return(creep);
  }

  // Do the work
  switch (creep.memory.state.type) {
    case 'collect':
      const mine = Game.getObjectById(creep.memory.state.destination);

      if (!(mine instanceof Source)) {
        throw Error('Destination was not a source');
      }

      if (creep.harvest(mine) === ERR_NOT_IN_RANGE) {
        creep.moveTo(mine, { visualizePathStyle: { stroke: '#ffaa00' } });
      }

      break;
    case 'idle':
      // Do nothing
      break;
    case 'return':
      const home = Game.getObjectById(creep.memory.state.destination);

      if (!(home instanceof Structure)) {
        throw Error('Destination was not a structure');
      }

      if (creep.transfer(home, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(home, { visualizePathStyle: { stroke: '#ffffff' } });
      }
      break;
  }
}

const isActiveEnergySource = (creep: Creep) => (source: Source) => {
  if (!source.energy) return false;
  else return true;
};

const isTargetStructure = (structure: AnyStructure) =>
  (structure.structureType == STRUCTURE_EXTENSION ||
    structure.structureType == STRUCTURE_SPAWN) &&
  hasFreeCapacity(structure.store, RESOURCE_ENERGY);

const hasFreeCapacity = (store: Store, resource?: ResourceConstant) =>
  store.getFreeCapacity(resource) || 0 > 0;

const memory: HarvesterCreep['memory'] = {
  role: 'harvester',
  state: { type: 'idle' },
};

export default {
  run: harvester,
  body: [WORK, CARRY, MOVE],
  memory,
};
