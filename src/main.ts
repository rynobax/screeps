import tasks, { initializeTaskMemory } from 'tasks';
import { ErrorMapper } from 'utils/ErrorMapper';
import { commandCreeps, spawnCreeps, creepTypes } from './creeps';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // resetAll();
  setupMemory();
  clearMemory();
  spawnCreeps();
  commandCreeps();
});

function setupMemory() {
  if (!Memory.rooms) Memory.rooms = {};
  Object.keys(Game.rooms).forEach((room) => {
    if(!Memory.rooms[room]) initializeTaskMemory(room);
  });
}

function cleanupCreep(name: string) {
  const creep = Memory.creeps[name];
  const currentTaskName = creep.state.type;
  const currentTask = tasks[currentTaskName];

  // Run cleanup
  currentTask.terminate(creep as any);

  // Remove reference to creep
  delete Memory.creeps[name];
}

function clearMemory() {
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      cleanupCreep(name);
    } else {
      // Eventually this should not run every loop
      // Remove creeps that have been renamed
      const role = Memory.creeps[name].role;
      if (!creepTypes[role]) {
        console.log(`suiciding old creep ${name}`);
        Game.creeps[name].suicide();
      }
    }
  }
}

// Use to start over
function resetAll() {
  for (const name in Memory.creeps) {
    const creep = Game.creeps[name];
    if(creep) creep.suicide();
  }
  Object.keys(Memory).forEach((k) => {
    delete (Memory as any)[k];
  });
  console.log('everything is reset');
}
