type State = { type: 'upgrade' };

interface UpgradeCreep extends Creep {
  memory: {
    role: Creep['memory']['role'];
    state: State;
  };
}

const upgrade: Task<UpgradeCreep> = {
  done: (creep: UpgradeCreep) => {
    return !creep.store.getUsedCapacity();
  },
  possible: (creep: Creep) => {
    return !!creep.store.getUsedCapacity();
  },
  run: (creep: UpgradeCreep) => {
    if (!creep.room.controller) {
      throw Error('Cannot upgrade with no controller');
    }

    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, {
        visualizePathStyle: { stroke: '#ffffff' },
      });
    }
  },
  initialize: (creep: UpgradeCreep) => {
    creep.memory.state = { type: 'upgrade' };
    return creep.memory;
  },
};

export default upgrade;
