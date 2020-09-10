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
  initialize: c => {
    const creep = c as IdleCreep;
    creep.memory.state = { type: 'idle' };
    return creep;
  },
};

export default idle;
