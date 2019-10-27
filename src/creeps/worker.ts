interface WorkerCreep extends Creep {
  memory: {
    role: 'worker';
    task: null | 'upgrade';
  };
}

function worker(creep: WorkerCreep) {
  // Select task
  if (!creep.memory.task) {
    // Upgrade
    if (creep.store.getFreeCapacity() === 0) {
      creep.say('Starting upgrade');
      creep.memory.task = 'upgrade';
    } else if (creep.store.getUsedCapacity() === 0) {
      creep.say('Ending upgrade');
      creep.memory.task = null;
    }
  }

  switch (creep.memory.task) {
    case 'upgrade':
      return upgrade(creep);
    default:
      creep.say('Nothing to do');
      return;
  }
}

function upgrade(creep: WorkerCreep) {
  if (!creep.room.controller) {
    return;
  }

  if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller, {
      visualizePathStyle: { stroke: '#ffffff' },
    });
  }
}

export default {
  run: worker,
  body: [WORK, CARRY, MOVE],
};
