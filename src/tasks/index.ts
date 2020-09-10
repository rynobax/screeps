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

type TaskMap = typeof tasks;
type TaskName = keyof TaskMap;

type NonIdleTask = Exclude<TaskName, 'idle'>;

export function doTask(creep: Creep, possibilities: NonIdleTask[]) {
  const currentTask = (creep.memory as any).state.type as TaskName;
  const current = tasks[currentTask];

  // If we aren't done yet, keep going
  if (!current.done(creep as any)) {
    return current.run(creep as any);
  }

  // If we are done, find next task to do
  for (const possibility of possibilities) {
    const task = tasks[possibility];
    if (task.possible(creep)) {
      // If we can do the next task, transition to that task
      creep.say(`${currentTask.slice(0, 4)}->${possibility.slice(0, 4)}`);
      task.initialize(creep as any);
      return task.run(creep as any);
    }
  }

  // If we have no tasks, go idle
  creep.say(`${currentTask} -> idle`);
  idle.initialize(creep as any);
  idle.run(creep as any);
}

export default tasks;
