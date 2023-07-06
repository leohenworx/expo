import { EventEmitter } from 'fbemitter';
import { useEffect, useRef } from 'react';
// Emitter and hook specifically for @expo/use-updates module
let _emitter;
function _getEmitter() {
    if (!_emitter) {
        _emitter = new EventEmitter();
    }
    return _emitter;
}
function addUseUpdatesListener(listener) {
    const emitter = _getEmitter();
    return emitter.addListener('Expo.useUpdatesEvent', listener);
}
export const useUpdateEvents = (listener) => {
    const listenerRef = useRef();
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
export const emitUseUpdatesEvent = (event) => {
    if (!_emitter) {
        throw new Error(`EventEmitter must be initialized to use from its listener`);
    }
    _emitter?.emit('Expo.useUpdatesEvent', event);
};
// Allows JS to emit a state change event (useful for testing)
export const emitStateChangeEvent = (event) => {
    if (!_emitter) {
        throw new Error(`EventEmitter must be initialized to use from its listener`);
    }
    _emitter?.emit('Expo.updatesStateChangeEvent', event);
};
//# sourceMappingURL=UseUpdatesEmitter.js.map