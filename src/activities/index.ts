import harvest from './harvest';
import idle from './idle';
import store from './store';
import upgrade from './upgrade';

const activities = {
  idle,
  harvest,
  store,
  upgrade,
};

type ActivitiesMap = typeof activities;
type Activity = keyof ActivitiesMap;

type NonIdleActivity = Exclude<Activity, 'idle'>;

export function doActivity(creep: Creep, possibilities: NonIdleActivity[]) {
  const currentActivity = (creep.memory as any).state.type as Activity;
  const current = activities[currentActivity];

  // If we aren't done yet, keep going
  if (!current.done(creep as any)) return current.run(creep as any);

  console.log('---')
  for (const possibility of possibilities) {
    console.log(possibility)
    const activity = activities[possibility];
    if (activity.possible(creep)) {
      creep.say(`${currentActivity.slice(0, 4)}->${possibility.slice(0, 4)}`);
      activity.transition(creep as any);
      return activity.run(creep as any);
    }
  }

  creep.say(`${currentActivity} -> idle`);
  idle.transition(creep as any);
  idle.run(creep as any);
}

export default activities;
