/**
 * Adopts the UIKit scene-based life cycle (required by the iOS 27 SDK).
 *
 * Background: Xcode 27 asserts at launch unless the app has a
 * `UIApplicationSceneManifest` and a `UIWindowSceneDelegate`. The `ios/`
 * directory in this repo is gitignored (CNG), and the prebuild template
 * bundled with the installed SDK still generates the old AppDelegate-only
 * shape, so this plugin applies the upstream Expo fix on every prebuild:
 *
 * - Info.plist: adds `UIApplicationSceneManifest` pointing at
 *   `$(PRODUCT_MODULE_NAME).SceneDelegate`
 * - `SceneDelegate.swift`: creates the window from the `UIWindowScene` and
 *   starts React Native via `ExpoAppSceneDelegate`
 * - `AppDelegate.swift`: migrates to the slim scene-based template (no longer
 *   creates the window itself)
 * - Xcode project: adds `SceneDelegate.swift` to the app target's sources
 *
 * Once the SDK's bundled template includes the scene files, this plugin
 * becomes a harmless no-op and can be removed.
 */
const fs = require('fs');
const path = require('path');
const {
  withInfoPlist,
  withXcodeProject,
  withDangerousMod,
} = require('@expo/config-plugins');

const SCENE_DELEGATE_FILE = 'SceneDelegate.swift';

const SCENE_DELEGATE_CONTENTS = `internal import Expo

@objc(SceneDelegate)
class SceneDelegate: ExpoAppSceneDelegate {
  // Extension point for config plugins.
}
`;

const APP_DELEGATE_CONTENTS = `internal import Expo
import React
import ReactAppDependencyProvider

@main
class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {
  var window: UIWindow?

  var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  public override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    // The window is created and React Native is started by \`SceneDelegate\` under the
    // scene-based life cycle (required by the iOS 27 SDK).
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}

class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
  // Extension point for config-plugins

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    // needed to return the correct URL for expo-dev-client.
    bridge.bundleURL ?? bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
`;

function withSceneManifest(config) {
  return withInfoPlist(config, (config) => {
    config.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).SceneDelegate',
          },
        ],
      },
    };
    return config;
  });
}

function getProjectName(modRequest, projectRoot) {
  if (modRequest.projectName) {
    return modRequest.projectName;
  }
  // Fallback: derive from the *.xcodeproj directory name.
  const entries = fs.readdirSync(projectRoot);
  const proj = entries.find((e) => e.endsWith('.xcodeproj'));
  if (proj) {
    return proj.replace(/\.xcodeproj$/, '');
  }
  return null;
}

function withSceneDelegateFiles(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.platformProjectRoot;
      const projectName = getProjectName(config.modRequest, projectRoot);
      const appDir = path.join(projectRoot, projectName);

      const sceneDelegatePath = path.join(appDir, SCENE_DELEGATE_FILE);
      if (!fs.existsSync(sceneDelegatePath)) {
        fs.writeFileSync(sceneDelegatePath, SCENE_DELEGATE_CONTENTS);
      }

      const appDelegatePath = path.join(appDir, 'AppDelegate.swift');
      const current = fs.existsSync(appDelegatePath)
        ? fs.readFileSync(appDelegatePath, 'utf8')
        : '';
      // Migrate the old window-creating AppDelegate to the scene-based one.
      // `UIWindow(frame:` only exists in the pre-scene template.
      if (current.includes('UIWindow(frame:')) {
        fs.writeFileSync(appDelegatePath, APP_DELEGATE_CONTENTS);
      }

      return config;
    },
  ]);
}

function findGroupKey(project, name) {
  const groups = project.hash?.project?.objects?.PBXGroup ?? {};
  for (const key of Object.keys(groups)) {
    const group = groups[key];
    if (group && (group.name === name || group.path === name)) {
      return key;
    }
  }
  return null;
}

function withSceneDelegateInXcode(config) {
  return withXcodeProject(config, (config) => {
    const project = config.modResults;
    const projectName = config.modRequest.projectName;
    const filePath = `${projectName}/${SCENE_DELEGATE_FILE}`;

    if (!project.hasFile(filePath)) {
      const groupKey = findGroupKey(project, projectName);
      const targetUuid = project.getFirstTarget().uuid;
      project.addSourceFile(filePath, { target: targetUuid }, groupKey);
    }
    return config;
  });
}

function withIosSceneLifecycle(config) {
  config = withSceneManifest(config);
  config = withSceneDelegateFiles(config);
  config = withSceneDelegateInXcode(config);
  return config;
}

module.exports = withIosSceneLifecycle;
