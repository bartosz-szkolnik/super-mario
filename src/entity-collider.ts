import type { Entity } from './entity';

export class EntityCollider {
  constructor(private readonly entities: Set<Entity>) {}

  check(subject: Entity) {
    this.entities.forEach(candidate => {
      if (subject === candidate) {
        return;
      }

      if (subject.bounds.overlaps(candidate.bounds)) {
        subject.collides(candidate);
        candidate.collides(subject);
      }
    });
  }
}
