// Copyright 2023-present 650 Industries. All rights reserved.

import React
import ExpoModulesCore

@objc(EXVersionedAppContextManager)
final class VersionedAppContextManager: NSObject {
  let appContext: AppContext

  @objc
  public init(
    withBridge bridge: RCTBridge,
    legacyModulesProxy: LegacyNativeModulesProxy,
    legacyModuleRegistry: EXModuleRegistry
  ) {
    appContext = AppContext(bridge: bridge, legacyModulesProxy: legacyModulesProxy, legacyModuleRegistry: legacyModuleRegistry)

    log.debug("Versioned app context manager: init(withBridge:)")

    appContext.useModulesProvider("ExpoModulesProvider")
    appContext.moduleRegistry.register(moduleType: ExpoGoModule.self)
  }
}
