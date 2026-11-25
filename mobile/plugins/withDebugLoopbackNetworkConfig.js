// Local Expo config plugin:
// - Release / main builds enforce cleartextTrafficPermitted="false" for all hosts.
// - Debug builds override @xml/network_security_config via Android's debug resource
//   source set to permit cleartext HTTP ONLY to loopback (127.0.0.1 and localhost)
//   for USB `adb reverse` local Supabase testing.
const fs = require("node:fs");
const path = require("node:path");
const { withAndroidManifest, withDangerousMod } = require("@expo/config-plugins");

const MAIN_NETWORK_SECURITY_CONFIG = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <base-config cleartextTrafficPermitted="false" />
</network-security-config>
`;

const DEBUG_NETWORK_SECURITY_CONFIG = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <base-config cleartextTrafficPermitted="false" />
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="false">127.0.0.1</domain>
    <domain includeSubdomains="false">localhost</domain>
  </domain-config>
</network-security-config>
`;

function withDebugLoopbackNetworkConfig(config) {
  config = withAndroidManifest(config, (modConfig) => {
    const app = modConfig.modResults.manifest.application?.[0];
    if (app) {
      app.$["android:networkSecurityConfig"] = "@xml/network_security_config";
      delete app.$["android:usesCleartextTraffic"];
    }
    return modConfig;
  });

  return withDangerousMod(config, [
    "android",
    async (modConfig) => {
      const androidRoot = modConfig.modRequest.platformProjectRoot;
      const mainXmlDir = path.join(androidRoot, "app", "src", "main", "res", "xml");
      const debugXmlDir = path.join(androidRoot, "app", "src", "debug", "res", "xml");
      const debugManifestPath = path.join(
        androidRoot,
        "app",
        "src",
        "debug",
        "AndroidManifest.xml",
      );

      fs.mkdirSync(mainXmlDir, { recursive: true });
      fs.mkdirSync(debugXmlDir, { recursive: true });

      fs.writeFileSync(
        path.join(mainXmlDir, "network_security_config.xml"),
        MAIN_NETWORK_SECURITY_CONFIG,
        "utf8",
      );
      fs.writeFileSync(
        path.join(debugXmlDir, "network_security_config.xml"),
        DEBUG_NETWORK_SECURITY_CONFIG,
        "utf8",
      );

      if (fs.existsSync(debugManifestPath)) {
        const existing = fs.readFileSync(debugManifestPath, "utf8");
        const cleaned = existing
          .replace(/\s*android:usesCleartextTraffic="true"/g, "")
          .replace(/\s*tools:replace="android:usesCleartextTraffic"/g, "");
        if (cleaned !== existing) {
          fs.writeFileSync(debugManifestPath, cleaned, "utf8");
        }
      }

      return modConfig;
    },
  ]);
}

module.exports = withDebugLoopbackNetworkConfig;
