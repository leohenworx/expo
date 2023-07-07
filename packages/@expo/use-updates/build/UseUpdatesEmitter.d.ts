import type { UpdatesNativeStateChangeEvent } from 'expo-updates';
import { UseUpdatesEvent } from './UseUpdates.types';
export declare const useUpdateEvents: (listener: (event: UseUpdatesEvent) => void) => void;
export declare const emitUseUpdatesEvent: (event: UseUpdatesEvent) => void;
export declare const emitStateChangeEvent: (event: UpdatesNativeStateChangeEvent) => void;
//# sourceMappingURL=UseUpdatesEmitter.d.ts.map