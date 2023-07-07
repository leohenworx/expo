import * as Updates from 'expo-updates';
import type { UpdatesNativeStateMachineContext } from 'expo-updates';

import type { CurrentlyRunningInfo, UseUpdatesStateType } from './UseUpdates.types';

// The currently running info, constructed from Updates constants
export const currentlyRunning: CurrentlyRunningInfo = {
  updateId: Updates.updateId,
  channel: Updates.channel,
  createdAt: Updates.createdAt,
  isEmbeddedLaunch: Updates.isEmbeddedLaunch,
  isEmergencyLaunch: Updates.isEmergencyLaunch,
  manifest: Updates.manifest,
  runtimeVersion: Updates.runtimeVersion,
};

/////// Internal functions ////////

// Constructs the availableUpdate from the native state change event context
export const availableUpdateFromContext = (context: { [key: string]: any }) => {
  const manifest = context?.latestManifest;
  const isRollback = context.isRollback;
  return manifest || isRollback
    ? {
        updateId: manifest?.id ?? null,
        createdAt:
          manifest && 'createdAt' in manifest && manifest.createdAt
            ? new Date(manifest.createdAt)
            : manifest && 'publishedTime' in manifest && manifest.publishedTime
            ? new Date(manifest.publishedTime)
            : null,
        manifest: manifest || null,
        isRollback,
      }
    : undefined;
};

// Constructs the downloadedUpdate from the native state change event context
export const downloadedUpdateFromContext = (context: { [key: string]: any }) => {
  const manifest = context?.downloadedManifest;
  const isRollback = context.isRollback;
  return manifest || isRollback
    ? {
        updateId: manifest?.id ?? null,
        createdAt:
          manifest && 'createdAt' in manifest && manifest.createdAt
            ? new Date(manifest.createdAt)
            : manifest && 'publishedTime' in manifest && manifest.publishedTime
            ? new Date(manifest.publishedTime)
            : null,
        manifest: manifest || null,
        isRollback,
      }
    : undefined;
};

// Default useUpdates() state
export const defaultUseUpdatesState: UseUpdatesStateType = {
  isChecking: false,
  isDownloading: false,
  isUpdateAvailable: false,
  isUpdatePending: false,
};

// Transform the useUpdates() state based on native state machine context
export const reduceUpdatesStateFromContext = (
  updatesState: UseUpdatesStateType,
  context: UpdatesNativeStateMachineContext
) => {
  if (context.isChecking) {
    return {
      ...updatesState,
      isChecking: true,
      lastCheckForUpdateTimeSinceRestart: new Date(),
    };
  }
  const availableUpdate = availableUpdateFromContext(context);
  const downloadedUpdate = downloadedUpdateFromContext(context);
  return {
    ...updatesState,
    isUpdateAvailable: context.isUpdateAvailable,
    isUpdatePending: context.isUpdatePending || availableUpdate?.isRollback || false,
    isChecking: context.isChecking,
    isDownloading: context.isDownloading,
    availableUpdate,
    downloadedUpdate,
    error: context.checkError || context.downloadError,
  };
};
