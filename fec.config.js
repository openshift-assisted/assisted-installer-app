const path = require('path');

/**
 * @typedef {Object} FEConfig
 * @property {string} appUrl
 * @property {boolean} interceptChromeConfig
 */

/** @type {import('webpack').Configuration & FEConfig} */
module.exports = {
  appUrl: '/openshift/assisted-installer-app',
  debug: true,
  useProxy: true,
  proxyVerbose: true,
  /**
   * Change accordingly to your appname in package.json.
   * The `sassPrefix` attribute is only required if your `appname` includes the dash `-` characters.
   * If the dash character is present, you will have to add a camelCase version of it to the sassPrefix.
   * If it does not contain the dash character, remove this configuration.
   */
  sassPrefix: '.assisted-installer-app, .assistedInstallerApp',
  /**
   * Change to false after your app is registered in configuration files
   */
  interceptChromeConfig: false,
  /**
   * Add additional webpack plugins
   */
  plugins: [],
  _unstableHotReload: process.env.HOT === 'true',
  moduleFederation: {
    exposes: {
      './RootApp': path.resolve(__dirname, './src/components/root-app.tsx'),
      './TechnologyPreview': path.resolve(
        __dirname,
        './src/components/technologypreview.tsx'
      ),
      './NoPermissionsError': path.resolve(
        __dirname,
        './src/components/nopermissionserror.tsx'
      ),
    },
    exclude: ['react', 'react-dom'],
    shared: [
      {
        react: {
          singleton: true,
          import: false,
          requiredVersion: '>=16.8 || >=17',
        },
        'react-dom': {
          singleton: true,
          import: false,
          requiredVersion: '>=16.8 || >=17',
        },
      },
    ],
  },
};
