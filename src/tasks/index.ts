import harvest from './harvest';
import idle from './idle';
import store from './store';
import upgrade from './upgrade';

const tasks = {
  idle,
  harvest,
  store,
  upgrade,
};

export function doTask(creep: Creep, possibilities: TaskName[]) {
  const currentTaskName = creep.memory.state.type;
  const currentTask = tasks[currentTaskName];

  // If we aren't done yet, keep going
  if (!currentTask.done(creep as any)) {
    return currentTask.run(creep as any);
  }

  // If we are done, find next task to do
  for (const possibility of possibilities) {
    const nextTask = tasks[possibility];
    if (nextTask.possible(creep)) {
      // If we can do the next task, transition to that task
      creep.say(`${currentTaskName.slice(0, 4)}->${possibility.slice(0, 4)}`);
      nextTask.initialize(creep);
      return nextTask.run(creep as any);
    }
  }

  // If we have no tasks, go idle
  creep.say(`${currentTaskName} -> idle`);
  const idleCreep = idle.initialize(creep);
  idle.run(idleCreep);
}

export default tasks;
