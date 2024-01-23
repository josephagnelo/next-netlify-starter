module.exports = {
 
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          // fixes proxy-agent dependencies
          net: false,
          dns: false,
          tls: false,
          assert: false,
          // fixes next-i18next dependencies
          path: false,
          fs: false,
          // fixes mapbox dependencies
          events: false,
          // fixes sentry dependencies
          process: false,
         //
         readline: false,
         child_process: false
        }
      };
    }
    config.module.exprContextCritical = false; // Workaround to suppress next-i18next warning, see https://github.com/isaachinman/next-i18next/issues/1545

    return config;
  },
  
}
