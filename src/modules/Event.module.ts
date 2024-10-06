import Emittery from 'emittery';

export const eventsManager = new Emittery<{
  disconnect: undefined;
  connect: {
    session: any;
  };
}>();
