type State = { type: 'upgrade' };

interface UpgradeCreep extends Creep {
  memory: {
    role: Creep['memory']['role'];
    state: State;
  };
}

const upgrade: Task<UpgradeCreep> = {
  done: (creep) => {
    return !creep.store.getUsedCapacity();
  },
  possible: (creep) => {
    return !!creep.store.getUsedCapacity();
  },
  run: (creep) => {
    if (!creep.room.controller) {
      throw Error('Cannot upgrade with no controller');
    }

    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, {
        visualizePathStyle: { stroke: '#ffffff' },
      });
    }
  },
  initialize: (c) => {
    const creep = c as UpgradeCreep;
    creep.memory.state = { type: 'upgrade' };
    return creep;
  },
};

export default upgrade;
