import { loadGoomba } from './entities/goomba';
import { loadKoopa } from './entities/koopa';
import { loadMario } from './entities/mario';

export type EntityFactory = {
  mario: Awaited<ReturnType<typeof loadMario>>;
  goomba: Awaited<ReturnType<typeof loadGoomba>>;
  koopa: Awaited<ReturnType<typeof loadKoopa>>;
};

export async function loadEntities(audioContext: AudioContext) {
  return Promise.all([loadMario(audioContext), loadGoomba(), loadKoopa()]).then(
    ([createMario, createGoomba, createKoopa]) => {
      return { mario: createMario, goomba: createGoomba, koopa: createKoopa } satisfies EntityFactory;
    },
  );
}
