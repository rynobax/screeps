interface HarvesterCreep extends Creep {
  memory: {
    role: 'harvester';
    destination?: string;
  };
}

function harvester(creep: HarvesterCreep) {
  if (hasFreeCapacity(creep.store, RESOURCE_ENERGY)) {
    const sources = creep.room.find(FIND_SOURCES);

    // Find destination if one isn't set
    if (!creep.memory.destination) {
      const source = sources.find(findDesiredSource(creep));
      creep.memory.destination = source ? source.id : undefined;
    }

    const dest = sources.find(s => s.id === creep.memory.destination);

    if (!dest) {
      // Can't find destination anymore, bail
      // ENHANCE: Should find new task?
      delete creep.memory.destination;
      return;
    }

    if (creep.harvest(dest) === ERR_NOT_IN_RANGE) {
      creep.moveTo(dest, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
  } else {
    const [target] = creep.room.find(FIND_STRUCTURES, {
      filter: isTarget,
    });
    if (target) {
      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
  }
}

const findDesiredSource = (creep: Creep) => (source: Source) => {
  if (!source.energy) return false;
  else return true;
};

const isTarget = (structure: AnyStructure) =>
  (structure.structureType == STRUCTURE_EXTENSION ||
    structure.structureType == STRUCTURE_SPAWN) &&
  hasFreeCapacity(structure.store, RESOURCE_ENERGY);

const hasFreeCapacity = (store: Store, resource?: ResourceConstant) =>
  store.getFreeCapacity(resource) || 0 > 0;

export default {
  run: harvester,
  body: [WORK, CARRY, MOVE],
};
