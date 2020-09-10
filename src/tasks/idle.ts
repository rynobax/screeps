type State = { type: 'idle' };

interface IdleCreep extends Creep {
  memory: {
    role: Creep['memory']['role'];
    state: State;
  };
}

const idle: Task<IdleCreep> = {
  done: () => true,
  possible: () => true,
  run: creep => {
    creep.say('idle');
  },
  initialize: creep => {
    creep.memory.state = { type: 'idle' };
    return creep.memory;
  },
};

export default idle;
