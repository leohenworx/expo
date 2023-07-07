import type { UpdatesNativeStateChangeEvent } from 'expo-updates';
import { EventEmitter, EventSubscription } from 'fbemitter';
import { useEffect, useRef } from 'react';

import { UseUpdatesEvent } from './UseUpdates.types';

// Emitter and hook specifically for @expo/use-updates module

let _emitter: EventEmitter | null;

function _getEmitter(): EventEmitter {
  if (!_emitter) {
    _emitter = new EventEmitter();
  }
  return _emitter;
}

function addUseUpdatesListener(listener: (event: UseUpdatesEvent) => void): EventSubscription {
  const emitter = _getEmitter();
  return emitter.addListener('Expo.useUpdatesEvent', listener);
}

export const useUpdateEvents = (listener: (event: UseUpdatesEvent) => void) => {
  const listenerRef = useRef<typeof listener>();

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    if (listenerRef.current) {
      const subscription = addUseUpdatesListener(listenerRef.current);
      return () => {
        subscription.remove();
      };
    }
    return undefined;
  }, []);
};

// Allows JS to emit a useUpdates event (useful for testing)
export const emitUseUpdatesEvent = (event: UseUpdatesEvent) => {
  if (!_emitter) {
    throw new Error(`EventEmitter must be initialized to use from its listener`);
  }
  _emitter?.emit('Expo.useUpdatesEvent', event);
};

// Allows JS to emit a state change event (useful for testing)
export const emitStateChangeEvent = (event: UpdatesNativeStateChangeEvent) => {
  if (!_emitter) {
    throw new Error(`EventEmitter must be initialized to use from its listener`);
  }
  _emitter?.emit('Expo.updatesStateChangeEvent', event);
};
