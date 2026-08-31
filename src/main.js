import disableDevtool from "disable-devtool";

const isProd = process.env.NODE_ENV === "production";
const enableConfigJS = process.env.VUE_APP_CONFIGJS == "true";
const enableAntiDebugging = process.env.VUE_APP_DEBUGGING == "true";

const decodeConfigValue = (value) => {
  if (typeof value !== "string" || !value.startsWith("b64:")) {
    return value;
  }

  try {
    return window.atob(value.slice(4));
  } catch (error) {
    return "";
  }
};

const normalizePublicConfig = () => {
  if (typeof window === "undefined" || !window.APP_CONFIG) {
    return;
  }

  const config = window.APP_CONFIG;

  config.API_MIDDLEWARE_URL = decodeConfigValue(config.API_MIDDLEWARE_URL);
  config.API_MIDDLEWARE_KEY = decodeConfigValue(config.API_MIDDLEWARE_KEY);

  if (config.API_CONFIG && Array.isArray(config.API_CONFIG.staticBaseUrl)) {
    config.API_CONFIG.staticBaseUrl = config.API_CONFIG.staticBaseUrl.map(decodeConfigValue);
  }

  if (config.INVITE_CONFIG && config.INVITE_CONFIG.inviteLinkConfig) {
    config.INVITE_CONFIG.inviteLinkConfig.customDomain = decodeConfigValue(
      config.INVITE_CONFIG.inviteLinkConfig.customDomain
    );
  }
};

(async () => {
  try {
    if (!isProd || !enableConfigJS) {
      const res = await import('./config/index.js');
      if (typeof window !== 'undefined') {
        window.APP_CONFIG = res.config || res.default || res;
      }
    }

    normalizePublicConfig();
    
    // 反调试逻辑
    if (isProd && enableAntiDebugging) {
      disableDevtool()
    }
    
    // ⚠️ 确保在 config 加载后再初始化应用
    await import('./appInit.js');
  } catch (error) {
    console.error(error);
  }
})();
