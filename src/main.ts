import { ErrorMapper } from 'utils/ErrorMapper';
import { commandCreeps, spawnCreeps, creepTypes } from './creeps';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  setupMemory();
  clearMemory();
  spawnCreeps();
  commandCreeps();
});

function setupMemory() {
  if (!Memory.harvesters) Memory.harvesters = {};
}

function clearMemory() {
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
      Object.keys(Memory.harvesters).forEach((k) => {
        if (Memory.harvesters[k][name]) delete Memory.harvesters[k][name];
      });
    }

    // Eventually this should not run every loop
    // Remove creeps that have been renamed
    const role = Memory.creeps[name].role;
    if (!creepTypes[role]) {
      console.log(`suiciding old creep ${name}`);
      Game.creeps[name].suicide();
    }
  }
}
