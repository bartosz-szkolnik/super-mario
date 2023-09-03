import type { Entity } from './entity';

export class InputRouter {
  private readonly receivers = new Set<Entity>();

  addReceiver(receiver: Entity) {
    this.receivers.add(receiver);
  }

  dropReceiver(receiver: Entity) {
    this.receivers.delete(receiver);
  }

  route(routeInput: (entity: Entity) => void) {
    for (const receiver of this.receivers) {
      routeInput(receiver);
    }
  }
}
