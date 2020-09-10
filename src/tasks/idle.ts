type State = { type: 'idle' };

interface IdleCreep extends Creep {
  memory: {
    role: Creep['memory']['role'];
    state: State;
  };
}

const idle: Task<IdleCreep> = {
  done: () => true,
  run: creep => {
    creep.say('idle');
  },
  initializeIfPossible: c => {
    const creep = c as IdleCreep;
    creep.memory.state = { type: 'idle' };
    return creep;
  },
  terminate: () => null,
};

export default idle;
