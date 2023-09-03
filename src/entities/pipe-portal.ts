import type { AudioBoard } from '../audio-board';
import { Entity } from '../entity';
import { loadAudioBoard } from '../loaders/audio';
import { Direction } from '../math';
import { Pipe } from '../traits';
import type { EntitySpec, PipePortalEntitySpec, PipePortalPropsSpec } from '../types';

export function isPipePortalEntitySpec(entity: EntitySpec | PipePortalEntitySpec): entity is PipePortalEntitySpec {
  return Object.hasOwn(entity, 'props') && entity.name === 'pipe-portal';
}

export async function loadPipePortal(audioContext: AudioContext) {
  const audio = await loadAudioBoard('pipe-portal', audioContext);
  return createPipePortalFactory(audio);
}

function createPipePortalFactory(audio: AudioBoard) {
  return function createPipePortal(props: PipePortalPropsSpec) {
    const pipe = new Pipe();
    pipe.direction.copy(Direction[props.dir]);

    const entity = new Entity();
    entity.props = props;
    entity.setAudio(audio);
    entity.size.set(24, 30);
    entity.addTrait(pipe);

    return entity;
  };
}
