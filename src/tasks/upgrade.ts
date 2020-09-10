import { PATH_STYLE } from "utils/constants";

type State = { type: 'upgrade' };

interface UpgradeCreep extends Creep {
  memory: {
    role: Creep['memory']['role'];
    state: State;
  };
}

function possible(creep: Creep) {
  return !!creep.store.getUsedCapacity();
}

const upgrade: Task<UpgradeCreep> = {
  done: (creep) => {
    return !creep.store.getUsedCapacity();
  },
  run: (creep) => {
    if (!creep.room.controller) {
      throw Error('Cannot upgrade with no controller');
    }

    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, { visualizePathStyle: PATH_STYLE.UPGRADE });
    }
  },
  initializeIfPossible: (c) => {
    if(!possible(c)) return null;

    const creep = c as UpgradeCreep;
    creep.memory.state = { type: 'upgrade' };
    return creep;
  },
  terminate: () => null,
};

export default upgrade;
