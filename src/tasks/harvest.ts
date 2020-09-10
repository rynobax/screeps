import { PATH_STYLE } from 'utils/constants';

type State = { type: 'harvest'; destination: Id<Source> };

interface HarvestCreep extends Creep {
  memory: {
    role: Creep['memory']['role'];
    state: State;
  };
}

const maxHarvestersForEnergySource = (source: Source) => {
  const src = source.pos;

  let openSpots = 0;
  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      // ignore source
      if (x === 0 && y === 0) continue;

      const pos = source.room.getPositionAt(src.x + x, src.y + y);
      if (pos) {
        const stuff = pos.look();
        const isWall = !!stuff.find((e) => e.terrain === 'wall');
        if (!isWall) openSpots++;
      }
    }
  }

  return openSpots;
};

const findOpenEnergySource = (source: Source) => {
  if (!source.energy) return false;
  if (!Memory.harvesters[source.id]) {
    Memory.harvesters[source.id] = {
      max: maxHarvestersForEnergySource(source),
      claims: {},
    };
  }
  const max = Memory.harvesters[source.id].max;
  if (Object.keys(Memory.harvesters[source.id].claims).length > max)
    return false;
  else return true;
};

function claimSource(source: Source, creep: Creep) {
  Memory.harvesters[source.id].claims[creep.name] = true;
}

function releaseSource(source: Source, creep: Creep) {
  delete Memory.harvesters?.[source.id].claims?.[creep.name];
}

function getSource(creep: HarvestCreep) {
  const mine = Game.getObjectById(creep.memory.state.destination);

  if (!mine) {
    throw Error('Destination is null');
  }

  return mine;
}

function possible(creep: Creep) {
  if (!creep.store.getFreeCapacity()) return false;
  const sources = creep.room.find(FIND_SOURCES);
  const source = sources.find(findOpenEnergySource);
  return !!source;
}

const harvest: Task<HarvestCreep> = {
  done: (creep) => {
    return !creep.store.getFreeCapacity();
  },
  run: (creep) => {
    const source = getSource(creep);

    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source, { visualizePathStyle: PATH_STYLE.HARVEST });
    }
  },
  initializeIfPossible: (c) => {
    if (!possible(c)) return null;

    const creep = c as HarvestCreep;
    const sources = creep.room.find(FIND_SOURCES);
    const source = sources.find(findOpenEnergySource);
    if (source) {
      claimSource(source, creep);
      creep.memory.state = { type: 'harvest', destination: source.id };
    }
    return creep;
  },
  terminate: (creep) => {
    const source = getSource(creep);
    releaseSource(source, creep);
  },
};

export default harvest;
