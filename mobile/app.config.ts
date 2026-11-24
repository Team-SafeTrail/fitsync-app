import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "FitSync",
  slug: "fitsync-mobile",
  version: "0.1.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  icon: "./assets/images/icon.png",
  android: {
    package: "com.safetrail.fitsync.debug",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#143E38",
    },
  },
  plugins: [
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 180,
        resizeMode: "contain",
        backgroundColor: "#F5F8F6",
      },
    ],
    "expo-secure-store",
    [
      "expo-font",
      {
        fonts: [
          "./assets/fonts/be-vietnam-pro-0.ttf",
          "./assets/fonts/be-vietnam-pro-1.ttf",
          "./assets/fonts/be-vietnam-pro-2.ttf",
          "./assets/fonts/be-vietnam-pro-3.ttf",
        ],
      },
    ],
    "./plugins/withDebugLoopbackNetworkConfig",
  ],
};

export default config;
