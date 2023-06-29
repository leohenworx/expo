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
function _addListener(listener) {
    const emitter = _getEmitter();
    return emitter.addListener('Expo.useUpdatesEvent', listener);
}
// What JS code uses to emit events
export const emitEvent = (event) => {
    if (!_emitter) {
        throw new Error(`EventEmitter must be initialized to use from its listener`);
    }
    _emitter.emit('Expo.useUpdatesEvent', event);
};
export const useUpdateEvents = (listener) => {
    const listenerRef = useRef();
    useEffect(() => {
        listenerRef.current = listener;
    }, [listener]);
    useEffect(() => {
        if (listenerRef.current) {
            const subscription = _addListener(listenerRef.current);
            return () => {
                subscription.remove();
            };
        }
        return undefined;
    }, []);
};
//# sourceMappingURL=UseUpdatesEmitter.js.map