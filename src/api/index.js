import nkn from 'nkn-client';
import Promise from 'bluebird';
import emitter from '@/emitter';

export default {
  createGameRoom: async () => {
    emitter.emit('TOGGLE_ACTIVITY_INDICATOR', true);
    const client = nkn({
      identifier: 'gameRoom',
    });

    return new Promise((resolve) => {
      client.on('connect', () => {
        resolve(client);
        emitter.emit('TOGGLE_ACTIVITY_INDICATOR', false);
      });
    });
  },
};
